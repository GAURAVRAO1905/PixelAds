import asyncHandler from 'express-async-handler';
import fs from 'fs';
import path from 'path';
import Daily from '../models/dailydataModel.js';
import Location from '../models/locationModel.js';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { CarLocationDuration, CampaignLocationDuration } from '../models/aggregatedDataModels.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EARTH_RADIUS_KM = 6371; // Radius of the Earth in kilometers

function radians(degrees) {
  return degrees * (Math.PI / 180);
}

function isWithinRadius(lat1, lon1, lat2, lon2, radiusKm) {
  const dLat = radians(lat2 - lat1);
  const dLon = radians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(radians(lat1)) * Math.cos(radians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return distance <= radiusKm;
}

const uploadFile = asyncHandler(async (req, res) => {
  const filePath = path.join(__dirname, '../public/uploads', req.file.filename);

  try {
    const { carId } = req.body; // Get carId from the request body
    if (!carId) {
      return res.status(400).json({ message: 'Car ID is required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const events = [];

    const locations = await Location.find({});

    lines.forEach(line => {
      const parts = line.split(',').map(item => item.trim());
      const [date, time, lat, lon, campaignId, trigger] = parts;

      const eventDate = new Date(date);
      const eventTime = time.trim();

      const event = {
        carId, // Use the carId from the request body
        date: eventDate,
        time: eventTime,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        campaignId: new mongoose.Types.ObjectId(campaignId),
        trigger: parseInt(trigger),
        locationId: null,
      };

      for (const location of locations) {
        if (isWithinRadius(event.latitude, event.longitude, location.latitude, location.longitude, location.radius)) {
          event.locationId = location._id;
          break;
        }
      }

      events.push(event);
    });

    let newEventsAdded = false;

    for (const event of events) {
      let daily = await Daily.findOne({ carId: event.carId });
      if (!daily) {
        daily = new Daily({
          carId: event.carId,
          dates: [{
            date: event.date,
            events: [event],
          }],
        });
        newEventsAdded = true;
        await daily.save();
      } else {
        const existingDateEntryIndex = daily.dates.findIndex(dateEntry => dateEntry.date.getTime() === event.date.getTime());
        if (existingDateEntryIndex !== -1) {
          const existingEventIndex = daily.dates[existingDateEntryIndex].events.findIndex(e => e.time === event.time);
          if (existingEventIndex !== -1) {
            daily.dates[existingDateEntryIndex].events[existingEventIndex] = event;
          } else {
            daily.dates[existingDateEntryIndex].events.push(event);
            newEventsAdded = true;
          }
        } else {
          daily.dates.push({
            date: event.date,
            events: [event],
          });
          newEventsAdded = true;
        }
        await daily.save();
      }
    }

    if (newEventsAdded) {
      const carLocationDurations = {};
      const campaignLocationDurations = {};

      for (const event of events) {
        if (event.locationId) {
          const carKey = `${event.carId}-${event.locationId}`;
          if (!carLocationDurations[carKey]) {
            carLocationDurations[carKey] = {
              carId: event.carId,
              locationId: event.locationId,
              duration: 0,
            };
          }
          carLocationDurations[carKey].duration += 1;

          const campaignKey = `${event.campaignId}-${event.locationId}`;
          if (!campaignLocationDurations[campaignKey]) {
            campaignLocationDurations[campaignKey] = {
              campaignId: event.campaignId,
              locationId: event.locationId,
              duration: 0,
            };
          }
          campaignLocationDurations[campaignKey].duration += 1;
        }
      }

      for (const key in carLocationDurations) {
        const { carId, locationId, duration } = carLocationDurations[key];
        const existing = await CarLocationDuration.findOne({ carId, locationId });
        if (existing) {
          existing.duration += duration;
          await existing.save();
        } else {
          await CarLocationDuration.create({ carId, locationId, duration });
        }
      }

      for (const key in campaignLocationDurations) {
        const { campaignId, locationId, duration } = campaignLocationDurations[key];
        const existing = await CampaignLocationDuration.findOne({ campaignId, locationId });
        if (existing) {
          existing.duration += duration;
          await existing.save();
        } else {
          await CampaignLocationDuration.create({ campaignId, locationId, duration });
        }
      }
    }

    res.status(201).json({ message: 'Data uploaded and saved successfully' });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Error processing file', error: error.message });
  } finally {
    // Delete the file after processing
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log('File deleted successfully');
      }
    });
  }
});

export { uploadFile };

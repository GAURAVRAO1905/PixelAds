import asyncHandler from 'express-async-handler';
import Location from '../models/locationModel.js';
import { CarLocationDuration } from '../models/aggregatedDataModels.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createLocation = asyncHandler(async (req, res) => {
  const { hotspot, latitude, longitude, radius } = req.body;
  const createdBy = req.user._id;

  // Convert latitude and longitude to numbers
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  // Validate latitude and longitude
  if (isNaN(lat) || isNaN(lon)) {
    res.status(400);
    throw new Error('Invalid latitude or longitude');
  }

  // Check if the location already exists
  let location = await Location.findOne({ latitude: lat, longitude: lon });

  if (location) {
    // Location exists, add new images to it
    req.files.forEach((file) => {
      location.images.push({ url: file.path, flag: 0 }); // Default flag value can be changed as needed
    });
  } else {
    // Create a new location
    location = new Location({
      createdBy,
      hotspot,
      latitude: lat,
      longitude: lon,
      radius,
      images: req.files.map((file) => ({
        url: file.path,
        flag: 0, // Default flag value can be changed as needed
      })),
    });
  }

  await location.save();
  res.status(201).json(location);
});

const getHotspots = asyncHandler(async (req, res) => {
  const hotspots = await Location.distinct('hotspot');
  res.json(hotspots);
});

const getHotspotData = asyncHandler(async (req, res) => {
  try {
    const { carId } = req.query;

    if (!carId) {
      return res.status(400).json({ message: 'Car ID is required in the query parameters' });
    }

    // Get car location durations for the specified carId
    let carLocationDurations = await CarLocationDuration.aggregate([
      {
        $match: { carId },
      },
      {
        $group: {
          _id: '$locationId',
          totalDuration: { $sum: '$duration' },
        },
      },
      {
        $lookup: {
          from: 'locations',
          localField: '_id',
          foreignField: '_id',
          as: 'location',
        },
      },
      {
        $unwind: '$location',
      },
      {
        $project: {
          _id: '$location._id',
          hotspot: '$location.hotspot',
          latitude: '$location.latitude',
          longitude: '$location.longitude',
          radius: '$location.radius',
          totalDuration: 1,
        },
      },
    ]);

    if (carLocationDurations.length > 0) {
      // Sort by totalDuration in descending order
      carLocationDurations.sort((a, b) => b.totalDuration - a.totalDuration);

      // Get location IDs and find locations with images flag value 0
      const locationIds = carLocationDurations.map((carLoc) => carLoc._id);
      const locations = await Location.find({ _id: { $in: locationIds } });

      const locationsWithImages = locations.map((location) => {
        const imagesWithFlag0 = location.images.filter((image) => image.flag === 0);
        return {
          _id: location._id,
          hotspot: location.hotspot,
          latitude: location.latitude,
          longitude: location.longitude,
          radius: location.radius,
          totalDuration: carLocationDurations.find((carLoc) => carLoc._id.equals(location._id)).totalDuration,
          images: imagesWithFlag0,
        };
      });

      // Sort locationsWithImages by totalDuration in descending order
      locationsWithImages.sort((a, b) => b.totalDuration - a.totalDuration);

      let textContent = '';
      locationsWithImages.forEach((location) => {
        textContent += `${location.latitude}, ${location.longitude}, ${location.radius}`;
        location.images.forEach((image) => {
          textContent += `, ${image._id}`;
        });
        textContent += '\n'; // Add a newline after each location
      });

      // Ensure the 'public/downloads' directory exists
      const downloadsDir = path.join(__dirname, '..', 'public', 'downloads');

      if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
      }

      // Write text content to a file
      const fileName = `hotspot_data_${Date.now()}.txt`;
      const filePath = path.join(downloadsDir, fileName);

      fs.writeFileSync(filePath, textContent);

      // Set headers for text file download
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.setHeader('Content-Type', 'text/plain');

      // Send the file
      res.sendFile(fileName, { root: downloadsDir }, (err) => {
        // Always delete the file after attempting to send it
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('File deletion failed:', unlinkErr);
          }
        });

        if (err) {
          console.error('File download failed:', err);
          res.status(500).json({ message: 'File download failed', error: err.message });
        }
      });
    } else {
      // If no data found for carId, return all locations with their details and images with flag 0
      const locations = await Location.find();
      const locationsWithImages = locations.map((location) => {
        const imagesWithFlag0 = location.images.filter((image) => image.flag === 0);
        return {
          _id: location._id,
          hotspot: location.hotspot,
          latitude: location.latitude,
          longitude: location.longitude,
          radius: location.radius,
          totalDuration: 0, // Default value when no data is found for the given carId
          images: imagesWithFlag0,
        };
      });

      let textContent = '';
      locationsWithImages.forEach((location) => {
        textContent += `${location.latitude}, ${location.longitude}, ${location.radius}`;
        location.images.forEach((image) => {
          textContent += `, ${image._id}`;
        });
        textContent += '\n'; // Add a newline after each location
      });

      // Ensure the 'public/downloads' directory exists
      const downloadsDir = path.join(__dirname, '..', 'public', 'downloads');

      if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
      }

      // Write text content to a file
      const fileName = `hotspot_data_${Date.now()}.txt`;
      const filePath = path.join(downloadsDir, fileName);

      fs.writeFileSync(filePath, textContent);

      // Set headers for text file download
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.setHeader('Content-Type', 'text/plain');

      // Send the file
      res.sendFile(fileName, { root: downloadsDir }, (err) => {
        // Always delete the file after attempting to send it
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('File deletion failed:', unlinkErr);
          }
        });

        if (err) {
          console.error('File download failed:', err);
          res.status(500).json({ message: 'File download failed', error: err.message });
        }
      });
    }
  } catch (error) {
    console.error('Error fetching hotspot data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


export { createLocation, getHotspots, getHotspotData };

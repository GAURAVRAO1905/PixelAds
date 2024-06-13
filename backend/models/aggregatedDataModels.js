import mongoose from 'mongoose';

// Schema to store the duration each car spends at each location
const carLocationDurationSchema = new mongoose.Schema({
  carId: {
    type: String,
    required: true,
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  duration: {
    type: Number,
    required: true, // Duration in seconds
  },
});

// Add an index on carId and locationId
carLocationDurationSchema.index({ carId: 1, locationId: 1 });

const CarLocationDuration = mongoose.model('CarLocationDuration', carLocationDurationSchema);

// Schema to store the duration each campaign is displayed at each location
const campaignLocationDurationSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  duration: {
    type: Number,
    required: true, // Duration in seconds
  },
});

// Add an index on campaignId and locationId
campaignLocationDurationSchema.index({ campaignId: 1, locationId: 1 });

const CampaignLocationDuration = mongoose.model('CampaignLocationDuration', campaignLocationDurationSchema);

export { CarLocationDuration, CampaignLocationDuration };

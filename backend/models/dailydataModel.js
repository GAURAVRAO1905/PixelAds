import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  trigger: {
    type: Number,
    required: true,
    enum: [0, 1],
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    default: null, // Default value for locationId
  },
});

const dateEventsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  events: [eventSchema],
});

const dailyDataSchema = new mongoose.Schema({
  carId: {
    type: String,
    required: true,
    unique: true,
  },
  dates: [dateEventsSchema],
});

const Daily = mongoose.model('Daily', dailyDataSchema);

export default Daily;

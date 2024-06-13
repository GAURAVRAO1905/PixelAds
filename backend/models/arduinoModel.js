// models/ArduinoData.js

import mongoose from 'mongoose';

const arduinoDataSchema = new mongoose.Schema({
  carId: {
    type: String,
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  addressId: {
    type: String,
    required: true,
  },
  trigger: {
    type: Number,
    required: true,
    enum: [0, 1],
  },
},{
  timestamps: true,
});

const ArduinoData = mongoose.model('ArduinoData', arduinoDataSchema);

export default ArduinoData;

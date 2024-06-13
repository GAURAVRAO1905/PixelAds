import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  flag: {
    type: Number,
    required: true,
    enum: [0, 1], // Only allow values 0 or 1
  },
});

const locationSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hotspot:{
     type:String,
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
  images: [imageSchema],
  radius: {
    type: Number,
    required: true,
  },
},{
  timestamps: true,
});

const Location = mongoose.model('Location', locationSchema);

export default Location;

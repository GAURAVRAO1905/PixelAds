
import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  vehiclenumber: {
    type: String,
    required: true,
  },
  softwareid: {
    type: String,
    required: true,
  },
  drivername: {
    type: String,
    required: true,
  },
  drivercontact: {
    type: Number,
    required: true,
  },
   
},{
  timestamps: true,
});

const vehicleData = mongoose.model('vehicleData', vehicleSchema);

export default vehicleData;

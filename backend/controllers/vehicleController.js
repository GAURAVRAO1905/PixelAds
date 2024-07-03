import asyncHandler from 'express-async-handler';
import vehicleData from '../models/vehicleModel.js';

const vehicleregister = asyncHandler(async (req, res)=>
{
    const { vehiclenumber, softwareid, drivername, drivercontact } = req.body;

    const driverExists = await vehicleData.findOne({ vehiclenumber });
  
    if (driverExists) {
      res.status(400);
      throw new Error('Car already exists');
    }
  
    const vehicle = await vehicleData.create({
      vehiclenumber,
      softwareid,
      drivername,
      drivercontact
    });
  
    if (vehicle) {
      res.status(201).json({
        _id: vehicle._id,
        vehiclenumber: vehicle.vehiclenumber,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }

});

export {vehicleregister};
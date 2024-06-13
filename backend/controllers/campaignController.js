// campaignController.js

import asyncHandler from 'express-async-handler';
import Campaign from '../models/campaignModel.js';
import User from '../models/userModel.js';
import Location from '../models/locationModel.js';
import { instance } from "../server.js";
import crypto from "crypto";

// Create a new campaign
const createCampaign = asyncHandler(async (req, res) => {
  try {
    const { campaignName, startDate, endDate, totalBudget, locations, dayFrequency, timeSlots } = req.body;

    if (!req.file) {
      res.status(400).json({ error: 'Media file is required' });
      return;
    }

    const createdBy = req.user._id;

    const newCampaign = new Campaign({
      createdBy,
      campaignName,
      startDate,
      endDate,
      totalBudget,
      mediaFile: req.file.path,
      locations: locations.split(','),
      dayFrequency,
      timeSlots: timeSlots.split(','),
      paymentStatus: 'pending',
    });

    const savedCampaign = await newCampaign.save();

    // Update user with the newly created campaign ID
    const user = await User.findById(createdBy);
    if (user) {
      await user.addCampaign(savedCampaign._id);
    }

     // Find location by hotspot name and add images to it
     const locationHotspots = locations.split(',');
     for (const hotspot of locationHotspots) {
       const location = await Location.findOne({ hotspot });
 
       if (location) {
         location.images.push({ url: req.file.path, flag: 0 });
         await location.save();
       }
     }

    res.status(201).json(savedCampaign);  // Return the saved campaign
  } catch (error) {
    console.error('Error in createCampaign:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get campaign by ID
const getCampaignById = asyncHandler(async (req, res) => {
  const id = req.params.campaignId;
  const campaign = await Campaign.findById(id);

  if (!campaign) {
    return res.status(404).json({ message: "No Campaign found!" });
  }

  return res.status(200).json({ campaign });
});

// Get campaigns by user
const getCampaignsByUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const campaigns = await Campaign.find({ createdBy: userId });

    if (!campaigns || campaigns.length === 0) {
      return res.status(404).json({ message: 'No campaigns found for this user' });
    }

    res.status(200).json(campaigns);
  } catch (error) {
    console.error('Error in getCampaignsByUser:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Checkout
// controllers/campaignController.js

const checkOut = asyncHandler(async (req, res) => {
  try {
    const { amount } = req.body;
    

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    
    const options = {
      amount: amount.amount * 100, // Convert amount to paisa
      currency: "INR",
    };
    
    const order = await instance.orders.create(options);

   

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error in checkOut:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





const paymentVerification = asyncHandler(async (req, res) => {
  try {
    
    const { campaignId,orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    const userId = req.user._id;


    const body = razorpayOrderId + "|" + razorpayPaymentId;
  

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    

    const isAuthentic = expectedSignature === razorpaySignature;
   

    if (isAuthentic) {
      // Update campaign payment details
      const updatedCampaign = await Campaign.findOneAndUpdate(
        { _id: campaignId, createdBy: userId },
        {
          $set: {
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: razorpayPaymentId,
            razorpay_signature: razorpaySignature,
            paymentStatus: 'paid', // Update payment status if needed
          },
        },
        { new: true } // Return the updated document
      );
      
      

      if (!updatedCampaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }


      // Return success response with payment reference
      return res.status(200).json({ success: true, reference: razorpayPaymentId });
    } else {
      res.status(400).json({ success: false, error: 'Invalid Signature' });
    }
  } catch (error) {
    console.error('Error in paymentVerification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




export {
  createCampaign,
  getCampaignById,
  getCampaignsByUser,
  checkOut,
  paymentVerification,
};

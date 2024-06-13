// routes/campaignRoutes.js

import express from 'express';
import { createCampaign, getCampaignById, getCampaignsByUser, checkOut, paymentVerification } from '../controllers/campaignController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multerMiddleware.js';

const router = express.Router();


// POST /api/campaign/create - Create a new campaign
router.post('/create', protect, upload.single('mediaFile'), createCampaign);

// GET /api/campaign/:campaignId - Get campaign by ID
router.get('/:campaignId', protect, getCampaignById);

// GET /api/campaign - Get campaigns by user
router.get('/', protect, getCampaignsByUser);

// POST /api/campaign/checkout - Checkout endpoint
router.post('/checkout', protect, checkOut);

// POST /api/campaign/paymentverification - Payment verification endpoint
router.post('/paymentverification', protect, paymentVerification);

export default router;

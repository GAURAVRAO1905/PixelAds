import express from 'express';
import {createLocation,getHotspots, getHotspotData} from '../controllers/locationController.js'
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multerMiddleware.js';

const router = express.Router();

// POST /api/campaign/create - Create a new campaign
router.post('/create', protect, upload.array('mediaFile'), createLocation);

// GET /api/location/places - Fetch all unique places
router.get('/hotspots',protect, getHotspots);

router.get('/hotspotdata', protect, getHotspotData);

export default router;
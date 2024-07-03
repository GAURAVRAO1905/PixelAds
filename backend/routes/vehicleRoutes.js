import express from 'express';
import {vehicleregister} from '../controllers/vehicleController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

// POST /api/campaign/create - Create a new campaign
router.post('/register',protect, vehicleregister);


export default router;

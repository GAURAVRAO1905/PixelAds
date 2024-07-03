import express from 'express';
import {vehicleregister} from '../controllers/vehicleController.js'


const router = express.Router();

// POST /api/campaign/create - Create a new campaign
router.post('/register', vehicleregister);


export default router;
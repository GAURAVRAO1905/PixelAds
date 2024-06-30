import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { uploadFile } from '../controllers/dailyController.js';
import { uploadTextFile } from '../middleware/filemulterMiddleware.js';

const router = express.Router();

// Assuming 'dataFile' is the fieldname for your text file upload
router.post('/upload', uploadTextFile.single('dataFile'), uploadFile);

export default router;

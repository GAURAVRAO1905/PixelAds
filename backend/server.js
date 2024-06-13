import path from 'path';
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import dailyRoutes from './routes/dailyRoutes.js';
import Razorpay from "razorpay";

const port = process.env.PORT || 8000;

connectDB();

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const app = express();

// CORS configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/campaign',campaignRoutes);
app.use('/api/location',locationRoutes);
app.use('/api/daily', dailyRoutes);


if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID })
);

app.use(notFound);
app.use(errorHandler);




app.listen(port, () => console.log(`Server started on port ${port}`));

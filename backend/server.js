import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import evaluationRoutes from './src/routes/evaluationRoutes.js';
import questionRoutes from './src/routes/questionsRouter.js';
import authRoutes from './src/routes/authRouter.js';
import contactRoutes from './src/routes/contactRoutes.js';
import correctionRoutes from './src/routes/correctionRoutes.js';

import { errorHandler } from './src/middleware/errorHandler.js';

// Debug logs
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Loaded' : 'Missing');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Loaded' : 'Missing');

const app = express();
const PORT = process.env.PORT || 3000;

// ================= CORS =================
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://satharasingha-devmock-interview-coa.vercel.app'
  ],
  credentials: true
}));

// ================= MIDDLEWARE =================
app.use(express.json({ limit: '10mb' }));

// ================= MONGODB CONNECTION =================
const mongodbURI =
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/devmock_database';

mongoose.connect(mongodbURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// ================= ROUTES =================
app.use('/api/auth', authRoutes);
app.use('/api/evaluate', evaluationRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/correct', correctionRoutes);

// ================= HEALTH CHECK =================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// ================= ERROR HANDLER =================
app.use(errorHandler);

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
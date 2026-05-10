import dotenv from 'dotenv';
// Load environment variables FIRST - before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import evaluationRoutes from './src/routes/evaluationRoutes.js';
import questionRoutes from './src/routes/questionsRouter.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import authRoutes from './src/routes/authRouter.js'
import contactRoutes from './src/routes/contactRoutes.js';

// Debug: Check if email credentials are loaded
console.log('=== ENVIRONMENT VARIABLES CHECK ===');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Loaded' : '❌ Missing');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Loaded' : '❌ Missing');
console.log('Gemini API Key:', process.env.GEMINI_API_KEY ? '✅ Loaded' : '❌ Missing');
console.log('===================================');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
const mongodbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devmock_database';
mongoose.connect(mongodbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/evaluate', evaluationRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
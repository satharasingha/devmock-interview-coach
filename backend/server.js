import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import evaluationRoutes from './src/routes/evaluationRoutes.js';
import questionRoutes from './src/routes/questionsRouter.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import authRoutes from './src/routes/authRouter.js'
import contactRoutes from './src/routes/contactRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Log API key status (remove in production)
console.log('Gemini API Key loaded:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');
console.log('API Key length:', process.env.GEMINI_API_KEY?.length || 0);

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
  console.log(`Questions API: http://localhost:${PORT}/api/questions`);
});
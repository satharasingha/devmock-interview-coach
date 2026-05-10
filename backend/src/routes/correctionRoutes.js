import express from 'express';
import { correctTranscript, quickCorrect } from '../services/correctionService.js';

const router = express.Router();

// POST - Correct transcript using Groq
router.post('/correct', async (req, res) => {
  try {
    const { text, context } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const corrected = await correctTranscript(text, context || 'general interview question');
    
    res.json({
      original: text,
      corrected: corrected,
      success: true
    });
  } catch (error) {
    console.error('Correction endpoint error:', error);
    res.status(500).json({ 
      error: 'Correction failed',
      original: req.body.text,
      corrected: req.body.text,
      success: false
    });
  }
});

// POST - Quick correction without API
router.post('/quick-correct', (req, res) => {
  const { text } = req.body;
  const corrected = quickCorrect(text);
  res.json({ original: text, corrected });
});

export default router;
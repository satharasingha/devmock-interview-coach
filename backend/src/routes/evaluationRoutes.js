import express from 'express';
import { evaluateAnswer } from '../controllers/evaluationController.js';

const router = express.Router();

// POST /api/evaluate - Evaluate an answer
router.post('/', evaluateAnswer);

export default router;
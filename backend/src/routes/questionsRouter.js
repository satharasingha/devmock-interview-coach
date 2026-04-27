import express from 'express';
import Question from '../models/Question.js';

const router = express.Router();

// GET all questions
router.get('/', async (req, res) => {
  try {
    const { role, difficulty, limit = 50 } = req.query;
    const query = {};
    
    if (role) query.job_role = role;
    if (difficulty) query.difficulty = difficulty;
    
    const questions = await Question.find(query).limit(parseInt(limit));
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findOne({ id: parseInt(req.params.id) });
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new question
router.post('/', async (req, res) => {
  try {
    // Get the highest id if not provided
    let nextId = req.body.id;
    if (!nextId) {
      const lastQuestion = await Question.findOne().sort({ id: -1 });
      nextId = lastQuestion ? lastQuestion.id + 1 : 1;
    }
    
    const question = new Question({
      ...req.body,
      id: nextId
    });
    
    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update question
router.put('/:id', async (req, res) => {
  try {
    const updatedQuestion = await Question.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE question
router.delete('/:id', async (req, res) => {
  try {
    const deletedQuestion = await Question.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET random questions for interview
router.get('/random/:role', async (req, res) => {
  try {
    const { role } = req.params;
    const { limit = 10 } = req.query;
    
    const questions = await Question.aggregate([
      { $match: { job_role: role } },
      { $sample: { size: parseInt(limit) } }
    ]);
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
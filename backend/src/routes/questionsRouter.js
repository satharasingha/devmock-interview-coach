import express from 'express';
import Question from '../models/Question.js';

const router = express.Router();

// GET all questions (with filters)
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

// GET distinct job roles - ADD THIS ENDPOINT
router.get('/distinct-roles', async (req, res) => {
  try {
    const roles = await Question.distinct('job_role');
    res.json(roles);
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

// DELETE all questions for a specific job role
router.delete('/role/:jobRole', async (req, res) => {
  try {
    const { jobRole } = req.params;
    const decodedRole = decodeURIComponent(jobRole);
    
    const result = await Question.deleteMany({ job_role: decodedRole });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No questions found for this role' });
    }
    
    res.json({ 
      message: `Deleted ${result.deletedCount} questions for ${decodedRole}`,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET question count for a specific role
router.get('/count', async (req, res) => {
  try {
    const { role } = req.query;
    const query = {};
    
    if (role) query.job_role = role;
    
    const count = await Question.countDocuments(query);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
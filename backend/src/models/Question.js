import mongoose from 'mongoose';

// This defines the structure of your question data
const questionSchema = new mongoose.Schema({
  // Question ID
  id: {
    type: Number,
    required: true,
    unique: true
  },
  
  // Job role (Software Engineer, Data Scientist, etc.)
  job_role: {
    type: String,
    required: true
  },
  
  // The interview question
  question: {
    type: String,
    required: true
  },
  
  // The ideal/correct answer
  ideal_answer: {
    type: String,
    required: true
  },
  
  // Important keywords (stored as an array)
  core_keywords: [{
    type: String
  }],
  
  // Extra supporting keywords (stored as an array)
  supporting_keywords: [{
    type: String
  }],
  
  // Difficulty level
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  
  // Type of question (theory or coding)
  type: {
    type: String,
    enum: ['theory', 'coding'],
    default: 'theory'
  },
  
  // When the question was added
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the model
export default mongoose.model('Question', questionSchema);
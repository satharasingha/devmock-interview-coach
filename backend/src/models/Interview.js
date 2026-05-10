import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  role: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  duration: {
    type: Number,
    default: 0,
  },
  passed: {
    type: Boolean,
    default: false,
  },
  answers: [
    {
      question: String,
      userAnswer: String,
      score: Number,
      matchedKeywords: [String],
      missingKeywords: [String],
      timestamp: String,
    },
  ],
  feedback: {
    strengths: [String],
    improvements: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

interviewSchema.index({ userId: 1, createdAt: -1 });

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
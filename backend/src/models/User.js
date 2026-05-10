import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  // NEW: Interview History
  interviewHistory: [
    {
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
      },
      feedback: {
        strengths: [String],
        improvements: [String],
      },
      questionsAnswered: [
        {
          question: String,
          userAnswer: String,
          score: Number,
          matchedKeywords: [String],
        }
      ],
      duration: {
        type: Number, // in seconds
        default: 0,
      },
      passed: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

// Hash password before saving
userSchema.pre("save", async function() {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
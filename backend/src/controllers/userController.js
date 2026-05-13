import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";
import Interview from "../models/Interview.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Debug
console.log(
  "UserController - EMAIL_USER:",
  process.env.EMAIL_USER ? "Finded" : "Not Finded",
);

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET || "secret_key",
    { expiresIn: "7d" },
  );
};

// Create email transporter with proper configuration
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Email credentials missing in .env file");
    throw new Error("Email credentials not configured");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// AUTHENTICATION

// Register User
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    console.log("Registration attempt:", { fullName, email });

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide fullName, email, and password",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = new User({
      fullName,
      email: email.toLowerCase(),
      password,
      isAdmin: false,
      isBlocked: false,
      isEmailVerified: false,
    });

    await user.save();
    console.log("User created successfully:", user._id);

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error during registration",
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", { email });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account has been blocked. Contact support.",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error during login",
    });
  }
};

// Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// PASSWORD RESET

// Forgot Password - Send Reset Email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Forgot password request for:", email);

    if (!email) {
      return res.status(400).json({ message: "Please provide email address" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(200).json({
        message:
          "If your email is registered, you will receive a password reset link.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const transporter = createTransporter();
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"DevMock Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request - DevMock",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center;">
            <h2 style="color: #2563EB;">DevMock</h2>
            <p style="color: #666;">AI-Powered Career Support Platform</p>
          </div>
          <h3>Password Reset Request</h3>
          <p>Dear ${user.fullName},</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #2563EB; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px;">Reset Password</a>
          </div>
          <p>This link expires in 1 hour.</p>
          <p>If you didn't request this, ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to: ${user.email}`);

    res.status(200).json({
      message:
        "If your email is registered, you will receive a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Failed to send reset email." });
  }
};

// Verify Reset Token
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    console.error("Verify token error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    console.log(`Password reset successfully for: ${user.email}`);

    res
      .status(200)
      .json({ message: "Password has been reset successfully. Please login." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

// USER PROFILE

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const interviewCount = await Interview.countDocuments({
      userId: req.user.id,
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        interviewCount: interviewCount,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another account",
        });
      }
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (fullName) user.fullName = fullName;
    if (email) user.email = email.toLowerCase();

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// INTERVIEW HISTORY

// Save Interview Result
export const saveInterviewResult = async (req, res) => {
  try {
    const { role, score, feedback, answers, duration, passed } = req.body;

    const interview = new Interview({
      userId: req.user.id,
      role,
      date: new Date(),
      score,
      duration: duration || 0,
      passed: passed || false,
      answers: answers || [],
      feedback: feedback || { strengths: [], improvements: [] },
    });

    await interview.save();

    console.log(
      `Interview saved for user ${req.user.email}: ${role} - Score: ${score}`,
    );

    res.json({
      success: true,
      message: "Interview result saved successfully",
      interviewId: interview._id,
    });
  } catch (error) {
    console.error("Save interview error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get User Interview History
export const getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    const totalInterviews = interviews.length;
    const averageScore =
      interviews.length > 0
        ? Math.round(
            interviews.reduce((sum, i) => sum + i.score, 0) / interviews.length,
          )
        : 0;
    const passedCount = interviews.filter((i) => i.passed).length;
    const failedCount = totalInterviews - passedCount;
    const totalDuration = interviews.reduce(
      (sum, i) => sum + (i.duration || 0),
      0,
    );

    res.json({
      success: true,
      interviews,
      stats: {
        totalInterviews,
        averageScore,
        passedCount,
        failedCount,
        totalDuration: Math.round(totalDuration / 60),
      },
    });
  } catch (error) {
    console.error("Get interview history error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Single Interview Details
export const getInterviewDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findOne({ _id: id, userId: req.user.id });

    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });
    }

    res.json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("Get interview details error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Interview
export const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });
    }

    res.json({ success: true, message: "Interview deleted successfully" });
  } catch (error) {
    console.error("Delete interview error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//ADMIN FUNCTIONS

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Toggle user block status (Admin only)
export const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked },
      { new: true },
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
      user,
    });
  } catch (error) {
    console.error("Toggle block error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Toggle admin status (Admin only)
export const toggleAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.body;

    const adminCount = await User.countDocuments({ isAdmin: true });

    if (adminCount === 1 && isAdmin === false) {
      const userToUpdate = await User.findById(id);
      if (userToUpdate && userToUpdate.isAdmin) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot remove the only admin. At least one admin must exist.",
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isAdmin },
      { new: true },
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: `Admin status updated successfully`,
      user,
    });
  } catch (error) {
    console.error("Toggle admin error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADMIN INTERVIEW FUNCTIONS

// Get all interviews for all users (Admin only)
export const getAllInterviews = async (req, res) => {
  try {
    console.log("Admin fetching all interviews");

    const interviews = await Interview.find({})
      .sort({ createdAt: -1 })
      .limit(100);

    console.log(`Found ${interviews.length} total interviews`);

    res.json({
      success: true,
      interviews: interviews,
      total: interviews.length,
    });
  } catch (error) {
    console.error("Get all interviews error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get interview statistics for all users (Admin only)
export const getAdminInterviewStats = async (req, res) => {
  try {
    const totalInterviews = await Interview.countDocuments();
    const avgScore = await Interview.aggregate([
      { $group: { _id: null, avg: { $avg: "$score" } } },
    ]);
    const passedCount = await Interview.countDocuments({ passed: true });
    const failedCount = await Interview.countDocuments({ passed: false });

    // Get interviews by role
    const interviewsByRole = await Interview.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalInterviews,
        averageScore: avgScore[0]?.avg || 0,
        passedCount,
        failedCount,
        interviewsByRole,
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

import dotenv from 'dotenv';
// Load environment variables FIRST
dotenv.config();

import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Debug
console.log('UserController - EMAIL_USER:', process.env.EMAIL_USER ? '✅' : '❌');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET || "your_secret_key_here",
    { expiresIn: "7d" }
  );
};

// Create email transporter with proper configuration
const createTransporter = () => {
  // Check if credentials exist
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email credentials missing in .env file');
    throw new Error('Email credentials not configured');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Register User - FIXED: Always set isAdmin to false for new users
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    console.log("Registration attempt:", { fullName, email });

    if (!fullName || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide fullName, email, and password" 
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "User already exists with this email" 
      });
    }

    // IMPORTANT: Force isAdmin to false for ALL new registrations
    const user = new User({
      fullName,
      email: email.toLowerCase(),
      password,
      isAdmin: false,        // ← FORCE FALSE - NO NEW ADMINS
      isBlocked: false,
      isEmailVerified: false,
    });

    await user.save();
    console.log("User created successfully:", user._id);
    console.log("User isAdmin status:", user.isAdmin); // Should log false

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin, // This will be false
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Server error during registration" 
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
        message: "Please provide email and password" 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({ 
        success: false,
        message: "Account has been blocked. Contact support." 
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
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
      message: error.message || "Server error during login" 
    });
  }
};

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
        message: "If your email is registered, you will receive a password reset link." 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Create transporter
    const transporter = createTransporter();
    
    // Send email
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
          
          <h3 style="color: #333;">Password Reset Request</h3>
          
          <p>Dear ${user.fullName},</p>
          
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #2563EB, #06B6D4); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p>Or copy this link to your browser:</p>
          <p style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">${resetUrl}</p>
          
          <p>This link will expire in <strong>1 hour</strong>.</p>
          
          <p>If you didn't request this, please ignore this email.</p>
          
          <hr style="margin: 20px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            DevMock - AI-Powered Interview Preparation Platform<br>
            University of Plymouth, United Kingdom
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to: ${user.email}`);

    res.status(200).json({ 
      message: "If your email is registered, you will receive a password reset link." 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Failed to send reset email. Please try again later." });
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
      return res.status(400).json({ message: "Invalid or expired reset token" });
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
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    console.log(`Password reset successfully for: ${user.email}`);

    res.status(200).json({ message: "Password has been reset successfully. Please login." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

// Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
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
      message: "Server error" 
    });
  }
};

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json({ 
      success: true, 
      users,
      total: users.length 
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
      return res.status(404).json({ success: false, message: "User not found" });
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
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({ 
      success: true, 
      message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
      user 
    });
  } catch (error) {
    console.error("Toggle block error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Toggle admin status (Admin only) - With protection to prevent removing last admin
export const toggleAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.body;
    
    // Count existing admins
    const adminCount = await User.countDocuments({ isAdmin: true });
    
    // Check if this is the last admin being demoted
    if (adminCount === 1 && isAdmin === false) {
      const userToUpdate = await User.findById(id);
      if (userToUpdate && userToUpdate.isAdmin) {
        return res.status(400).json({ 
          success: false, 
          message: "Cannot remove the only admin. At least one admin must exist." 
        });
      }
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { isAdmin },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({ 
      success: true, 
      message: `Admin status updated successfully`,
      user 
    });
  } catch (error) {
    console.error("Toggle admin error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        interviewHistory: user.interviewHistory || [],
      }
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update User Profile (Only name and email)
export const updateUserProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    
    // Check if email already exists for another user
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: "Email already in use by another account" 
        });
      }
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    // Update fields
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
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Save Interview Result
export const saveInterviewResult = async (req, res) => {
  try {
    const { role, score, feedback, questionsAnswered, duration, passed } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    user.interviewHistory.push({
      role,
      date: new Date(),
      score,
      feedback,
      questionsAnswered,
      duration,
      passed,
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: "Interview result saved successfully",
    });
  } catch (error) {
    console.error("Save interview error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get User Interview History
export const getInterviewHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("interviewHistory");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({
      success: true,
      interviewHistory: user.interviewHistory || [],
    });
  } catch (error) {
    console.error("Get interview history error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
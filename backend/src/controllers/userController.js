import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET || "your_secret_key",
    { expiresIn: "7d" }
  );
};

export const registerUser = async (req, res) => {
  try {
    console.log("=== REGISTRATION START ===");
    console.log("Request body:", req.body);
    
    const { fullName, email, password } = req.body;

    // Validate input
    if (!fullName || !email || !password) {
      console.log("Missing fields:", { fullName, email, password });
      return res.status(400).json({ 
        message: "Please provide fullName, email, and password" 
      });
    }

    // Check if user exists
    console.log("Checking if user exists...");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    console.log("Creating new user...");
    const user = new User({
      fullName,
      email,
      password,
    });

    console.log("Saving user to database...");
    await user.save();
    console.log("User saved successfully:", user._id);

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
    console.error("=== REGISTRATION ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      message: error.message,
      error: error.name,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      success: true,
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
    res.status(500).json({ message: error.message });
  }
};
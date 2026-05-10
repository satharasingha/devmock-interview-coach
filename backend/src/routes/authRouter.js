import express from "express";
import { 
  registerUser, 
  loginUser, 
  getCurrentUser,
  forgotPassword,
  verifyResetToken,
  resetPassword
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);

// Private routes
router.get("/me", protect, getCurrentUser);

export default router;
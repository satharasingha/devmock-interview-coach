import express from "express";
import { 
  registerUser, 
  loginUser, 
  getCurrentUser,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  getAllUsers,
  deleteUser,
  toggleBlockUser,
  toggleAdminUser,
  getUserProfile,
  updateUserProfile,
  saveInterviewResult,
  getInterviewHistory,
  getInterviewDetails,
  deleteInterview,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);

// Protected routes (requires login)
router.get("/me", protect, getCurrentUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/interview/save", protect, saveInterviewResult);
router.get("/interview/history", protect, getInterviewHistory);
router.get("/interview/:id", protect, getInterviewDetails);
router.delete("/interview/:id", protect, deleteInterview);

// Admin only routes
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.put("/users/:id/block", protect, adminOnly, toggleBlockUser);
router.put("/users/:id/admin", protect, adminOnly, toggleAdminUser);

export default router;
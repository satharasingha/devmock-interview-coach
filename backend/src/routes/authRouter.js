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
  toggleAdminUser
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);

// Private routes
router.get("/me", protect, getCurrentUser);

// Admin only routes
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.put("/users/:id/block", protect, adminOnly, toggleBlockUser);
router.put("/users/:id/admin", protect, adminOnly, toggleAdminUser);

export default router;
import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserById,
  adminUpdateUser,
  adminDeleteUser
} from "../controllers/user.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { authorizeAdmin } from "../middleware/role.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticateToken, logoutUser);

// Admin
router.get("/", authenticateToken, authorizeAdmin, getAllUsers);
router.get("/:userId", authenticateToken, authorizeAdmin, getUserById);
router.put("/:userId", authenticateToken, authorizeAdmin, adminUpdateUser);
router.delete("/:userId", authenticateToken, authorizeAdmin, adminDeleteUser);

export default router;

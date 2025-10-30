import { Router } from "express";
import {
  createTransaction,
  getUserTransactions,
  updateTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransactionById,
  adminUpdateTransaction,
  adminDeleteTransaction,
  getMonthlyBreakdown,
  getRolling12MonthSummary
} from "../controllers/transaction.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { authorizeAdmin } from "../middleware/role.middleware";

const router = Router();

router.post("/", authenticateToken, createTransaction);
router.get("/", authenticateToken, getUserTransactions);
router.put("/:transactionId", authenticateToken, updateTransaction);
router.delete("/:transactionId", authenticateToken, deleteTransaction);

// Admin
router.get("/admin/all", authenticateToken, authorizeAdmin, getAllTransactions);
router.get("/admin/:transactionId", authenticateToken, authorizeAdmin, getTransactionById);
router.put("/admin/:transactionId", authenticateToken, authorizeAdmin, adminUpdateTransaction);
router.delete("/admin/:transactionId", authenticateToken, authorizeAdmin, adminDeleteTransaction);

// Analytics
router.get("/admin/analytics/monthly", authenticateToken, authorizeAdmin, getMonthlyBreakdown);
router.get("/admin/analytics/rolling12", authenticateToken, authorizeAdmin, getRolling12MonthSummary);

export default router;

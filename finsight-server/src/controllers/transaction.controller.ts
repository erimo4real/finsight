import { Request, Response } from "express";
import { TransactionService } from "../services/transaction.service";
import { AuthRequest } from "../middleware/auth.middleware";

const transactionService = new TransactionService();

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const payload = { ...req.body, userId: req.user?.id };
    const dto = await transactionService.createTransaction(payload);
    res.status(201).json(dto);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const txs = await transactionService.getTransactionsByUser(userId as string);
    res.status(200).json(txs);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const updated = await transactionService.updateTransaction(req.params.transactionId, req.body, userId);
    if (!updated) return res.status(404).json({ error: "Transaction not found" });
    res.status(200).json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const deleted = await transactionService.deleteTransaction(req.params.transactionId, userId);
    if (!deleted) return res.status(404).json({ error: "Transaction not found" });
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user?.id as string;
    const txs = await transactionService.getAllTransactions(adminId);
    res.status(200).json(txs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getTransactionById = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user?.id as string;
    const tx = await transactionService.getTransactionByIdAdmin(adminId, req.params.transactionId);
    if (!tx) return res.status(404).json({ error: "Transaction not found" });
    res.status(200).json(tx);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const adminUpdateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user?.id as string;
    const updated = await transactionService.adminUpdateTransaction(adminId, req.params.transactionId, req.body);
    if (!updated) return res.status(404).json({ error: "Transaction not found" });
    res.status(200).json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const adminDeleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user?.id as string;
    const deleted = await transactionService.adminDeleteTransaction(adminId, req.params.transactionId);
    if (!deleted) return res.status(404).json({ error: "Transaction not found" });
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getMonthlyBreakdown = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user?.id as string;
    const data = await transactionService.getMonthlyBreakdown(adminId);
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getRolling12MonthSummary = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user?.id as string;
    const data = await transactionService.getRolling12MonthSummary(adminId);
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

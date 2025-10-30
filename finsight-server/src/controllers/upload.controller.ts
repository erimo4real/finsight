// ADDED: central upload controller (profile & transaction)
import { Request, Response } from "express";
import { UploadService } from "../services/upload.service";
import fs from "fs";
import { UserRepository } from "../repositories/user.repository";
import { TransactionRepository } from "../repositories/transaction.repository";
import { AuthRequest } from "../middleware/auth.middleware";

const uploadService = new UploadService();
const userRepo = new UserRepository();
const txRepo = new TransactionRepository();

export const uploadProfileImage = async (req: AuthRequest, res: Response) => {
  try {
    // multer memoryStorage puts file buffer on req.file.buffer
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await uploadService.uploadBuffer(req.file.buffer, "profiles");

    // CHANGED: update user model with profileImage URL
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await userRepo.update(userId, { profileImage: result.url } as any);

    res.status(200).json({ url: result.url, publicId: result.publicId });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Upload failed" });
  }
};

export const uploadTransactionAttachment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { transactionId } = req.body;
    if (!transactionId) return res.status(400).json({ error: "transactionId is required" });

    const result = await uploadService.uploadBuffer(req.file.buffer, "receipts");

    // CHANGED: save attachmentUrl on transaction (only admin or owner allowed — check below)
    const tx = await txRepo.findById(transactionId);
    if (!tx) return res.status(404).json({ error: "Transaction not found" });

    // authorization: owner or admin
    const requesterId = req.user?.id;
    const requesterRole = req.user?.role;
    const ownerId = tx.userId?.toString ? tx.userId.toString() : (tx.userId as any);

    if (requesterRole !== "admin" && requesterId !== ownerId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await txRepo.updateByAdmin(transactionId, { attachmentUrl: result.url } as any);

    res.status(200).json({ url: result.url, publicId: result.publicId });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Upload failed" });
  }
};

import { BaseRepository } from "./base.repository";
import { ITransactionDocument, TransactionModel } from "../models/transaction.model";
import { ITransaction } from "../interfaces/transaction.interface";
import mongoose from "mongoose";

export class TransactionRepository extends BaseRepository<ITransactionDocument> {
  constructor() {
    super(TransactionModel);
  }

  async findByUser(userId: string) {
    return this.model.find({ userId }).sort({ date: -1 }).exec();
  }

  // CHANGED: Admin methods
  async findAll(): Promise<ITransactionDocument[]> {
    return this.model.find().sort({ date: -1 }).exec();
  }

  async findById(transactionId: string): Promise<ITransactionDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(transactionId)) return null;
    return this.model.findById(transactionId).exec();
  }

  async updateByAdmin(transactionId: string, data: Partial<ITransaction>): Promise<ITransactionDocument | null> {
    return this.model.findByIdAndUpdate(transactionId, data, { new: true }).exec();
  }

  async deleteWithUser(transactionId: string, userId: string): Promise<boolean> {
  const deleted = await this.model.deleteOne({ _id: transactionId, userId }).exec();
  return deleted.deletedCount === 1;
}


  // async deleteByAdmin(transactionId: string): Promise<boolean> {
  //   const result = await this.model.deleteOne({ _id: transactionId }).exec();
  //   return result.deletedCount === 1;
  // }

  // ✅ ADDED: User-aware update method (separate from BaseRepository.update)
  async updateWithUser(
    transactionId: string,
    data: Partial<ITransaction>,
    userId: string
  ): Promise<ITransactionDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(transactionId)) return null;
    const updated = await this.model.findByIdAndUpdate(transactionId, data, { new: true }).exec();

    // The audit logic stays in the service layer (keeps repository pure)
    return updated;
  }

  // CHANGED: Analytics
  async monthlyBreakdown(): Promise<any[]> {
    return this.model.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          totalDeposit: { $sum: { $cond: [{ $eq: ["$type", "deposit"] }, "$amount", 0] } },
          totalWithdrawal: { $sum: { $cond: [{ $eq: ["$type", "withdrawal"] }, "$amount", 0] } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).exec();
  }

  async rolling12MonthSummary(): Promise<any[]> {
    const now = new Date();
    const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    return this.model.aggregate([
      { $match: { date: { $gte: lastYear } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          totalDeposit: { $sum: { $cond: [{ $eq: ["$type", "deposit"] }, "$amount", 0] } },
          totalWithdrawal: { $sum: { $cond: [{ $eq: ["$type", "withdrawal"] }, "$amount", 0] } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).exec();
  }
}

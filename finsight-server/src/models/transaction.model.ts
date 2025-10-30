import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { ITransaction } from "../interfaces/transaction.interface";

export interface ITransactionDocument extends ITransaction, Document {
  _id: Types.ObjectId;
}

const TransactionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
    // ADDED:
    attachmentUrl: { type: String, required: false }, // CHANGED: optional receipt url
  },
  { timestamps: true }
);

export const TransactionModel: Model<ITransactionDocument> = mongoose.model<ITransactionDocument>(
  "Transaction",
  TransactionSchema
);

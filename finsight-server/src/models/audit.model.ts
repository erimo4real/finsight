import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditDocument extends Document {
  adminId: mongoose.Types.ObjectId;
  action: string;
  targetId?: mongoose.Types.ObjectId;
  targetType?: "user" | "transaction";
  timestamp: Date;
}

const AuditSchema: Schema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  targetId: { type: Schema.Types.ObjectId },
  targetType: { type: String, enum: ["user", "transaction"] },
  timestamp: { type: Date, default: Date.now },
});

export const AuditModel: Model<IAuditDocument> = mongoose.model<IAuditDocument>(
  "Audit",
  AuditSchema
);



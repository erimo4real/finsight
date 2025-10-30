import { AuditModel } from "../models/audit.model";
import { Types } from "mongoose";

export class AuditService {
  async logAction(
    adminId: string,
    action: string,
    targetId?: string,
    targetType?: "user" | "transaction"
  ) {
    const doc: any = {
      adminId: Types.ObjectId.isValid(adminId) ? new Types.ObjectId(adminId) : adminId,
      action,
      timestamp: new Date(),
    };
    if (targetId && Types.ObjectId.isValid(targetId)) doc.targetId = new Types.ObjectId(targetId);
    if (targetType) doc.targetType = targetType;
    const log = await AuditModel.create(doc);
    console.log(`📝 Audit: ${action} by ${adminId}${targetId ? ` on ${targetId}` : ""}`);
    return log;
  }
}

import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "../interfaces/user.interface";

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

const UserSchema: Schema<IUserDocument> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    // ADDED:
    profileImage: { type: String, required: false }, // CHANGED: optional cloud url
  },
  { timestamps: true }
);

export const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>("User", UserSchema);

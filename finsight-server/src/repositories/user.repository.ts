import { BaseRepository } from "./base.repository";
import { IUserDocument, UserModel } from "../models/user.model";
import mongoose from "mongoose";

export class UserRepository extends BaseRepository<IUserDocument> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string) {
    return this.model.findOne({ email }).exec();
  }

  // CHANGED: make findAll, findById, update, delete return without password
  async findAllSafe() {
    return this.model.find().select("-password").exec();
  }

  async findByIdSafe(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return this.model.findById(id).select("-password").exec();
  }
}

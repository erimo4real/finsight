import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/user.repository";
import { IUser } from "../interfaces/user.interface";
import { UserDTO } from "../dtos/user.dto";
import { AuditService } from "./audit.service";

const auditService = new AuditService();

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(userData: IUser): Promise<UserDTO> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    } as any);

    // ADDED: audit log for registration
    try {
      await auditService.logAction(user._id.toString(), "REGISTER", user._id.toString(), "user");
    } catch (e) {
      console.warn("Audit failed for register:", e);
    }

    return UserDTO.fromEntity(user);
  }

  async validateUser(email: string, password: string): Promise<UserDTO | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    // ADDED: audit log for login
    try {
      await auditService.logAction(user._id.toString(), "LOGIN", user._id.toString(), "user");
    } catch (e) {
      console.warn("Audit failed for login:", e);
    }

    return UserDTO.fromEntity(user);
  }

  // KEEP: some callers expect user service to generate JWT, but controllers prefer AuthService.
  generateJWT(user: UserDTO): string {
    const secret = process.env.JWT_SECRET || "default_secret_key";
    return require("jsonwebtoken").sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: "7d" }
    );
  }

  async getAllUsers(): Promise<UserDTO[]> {
    const users = await this.userRepository.findAllSafe();
    return users.map(UserDTO.fromEntity);
  }

  // CHANGED: Admin methods with audit
  async getUserByIdAdmin(adminId: string, userId: string): Promise<UserDTO | null> {
    const user = await this.userRepository.findByIdSafe(userId);
    if (!user) return null;
    await auditService.logAction(adminId, "ADMIN_VIEW_USER", userId, "user");
    return UserDTO.fromEntity(user);
  }

  async updateUserAdmin(adminId: string, userId: string, data: Partial<IUser>): Promise<UserDTO | null> {
    const updated = await this.userRepository.update(userId, data);
    if (!updated) return null;
    await auditService.logAction(adminId, "ADMIN_UPDATE_USER", userId, "user");
    return UserDTO.fromEntity(updated);
  }

  async deleteUserAdmin(adminId: string, userId: string): Promise<boolean> {
    const deleted = await this.userRepository.delete(userId);
    if (deleted) {
      await auditService.logAction(adminId, "ADMIN_DELETE_USER", userId, "user");
    }
    return !!deleted;
  }

  async logoutUser(email: string): Promise<void> {
    const u = await this.userRepository.findByEmail(email);
    if (u) {
      try {
        await auditService.logAction(u._id.toString(), "LOGOUT", u._id.toString(), "user");
      } catch (e) {
        console.warn("Audit failed for logout:", e);
      }
    }
  }
}

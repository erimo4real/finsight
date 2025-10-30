import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../middleware/auth.middleware";

const userService = new UserService();
const authService = new AuthService();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const dto = await userService.registerUser(req.body);
    res.status(201).json(dto);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const dto = await userService.validateUser(email, password);

    if (!dto) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = authService.generateToken({
      id: dto.id as string,
      email: dto.email,
      role: dto.role || "user",
    });

    res.status(200).json({
      message: "Login successful",
      user: dto,
      token,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const logoutUser = async (req: AuthRequest, res: Response) => {
  try {
    const email = req.user?.email;
    if (email) await userService.logoutUser(email);
    res.status(200).json({ message: "Logout successful" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user?.id as string;
    const user = await userService.getUserByIdAdmin(adminId, req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const adminUpdateUser = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user?.id as string;
    const updated = await userService.updateUserAdmin(adminId, req.params.userId, req.body);
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.status(200).json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const adminDeleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user?.id as string;
    const deleted = await userService.deleteUserAdmin(adminId, req.params.userId);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

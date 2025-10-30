import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { IUserDTO } from "../dtos/user.dto";

dotenv.config();

// Extend Express Request to include our custom user
export interface AuthRequest extends Request {
  user?: IUserDTO & JwtPayload; // user info + standard JWT fields (iat, exp)
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Expecting "Bearer <token>"

    if (!token) {
      return res.status(401).json({ error: "Access denied. Token missing." });
    }

    const secret = process.env.JWT_SECRET || "default_secret_key";

    const decoded = jwt.verify(token, secret) as IUserDTO & JwtPayload;
    req.user = decoded; // now strongly typed

    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

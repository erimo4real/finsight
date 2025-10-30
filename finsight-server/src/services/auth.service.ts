
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class AuthService {
  private secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || "default_secret_key";
  }

  // ADDED: centralize token creation
  generateToken(payload: { id: string; email: string; role: string }) {
    return jwt.sign(payload, this.secret, { expiresIn: "7d" });
  }

  // ADDED: verify token helper
  verifyToken(token: string) {
    return jwt.verify(token, this.secret);
  }
}

import { Response, NextFunction } from "express"; 
import { AuthRequest } from "./auth.middleware";

export const authorizeAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized. No user context." });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden. Admins only." });
    }

    next();
  } catch (error: any) {
    res.status(500).json({ error: "Role verification failed." });
  }
};


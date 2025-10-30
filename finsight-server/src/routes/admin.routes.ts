import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { authorizeAdmin } from "../middleware/role.middleware";
import { UserService } from "../services/user.service";
import { TransactionService } from "../services/transaction.service";

const router = Router();
const userService = new UserService();
const transactionService = new TransactionService();

// -----------------------------
// USER MANAGEMENT
// -----------------------------
router.get(
  "/users",
  authenticateToken,
  authorizeAdmin,
  async (_req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.json(users);
  }
);

router.get(
  "/users/:id",
  authenticateToken,
  authorizeAdmin,
  async (req: Request, res: Response) => {
    const user = await userService.getUserByIdAdmin(req.user!.id, req.params.id);
    res.json(user);
  }
);

router.put(
  "/users/:id",
  authenticateToken,
  authorizeAdmin,
  async (req: Request, res: Response) => {
    const updated = await userService.updateUserAdmin(
      req.user!.id,
      req.params.id,
      req.body
    );
    res.json(updated);
  }
);

router.delete(
  "/users/:id",
  authenticateToken,
  authorizeAdmin,
  async (req: Request, res: Response) => {
    const deleted = await userService.deleteUserAdmin(req.user!.id, req.params.id);
    res.json(deleted);
  }
);

// -----------------------------
// TRANSACTION MANAGEMENT
// -----------------------------
router.get(
  "/transactions",
  authenticateToken,
  authorizeAdmin,
  async (req: Request, res: Response) => {
    const txs = await transactionService.getAllTransactions(req.user!.id);
    res.json(txs);
  }
);

router.get(
  "/transactions/:id",
  authenticateToken,
  authorizeAdmin,
  async (req: Request, res: Response) => {
    const tx = await transactionService.getTransactionByIdAdmin(
      req.user!.id,
      req.params.id
    );
    res.json(tx);
  }
);

router.put(
  "/transactions/:id",
  authenticateToken,
  authorizeAdmin,
  async (req: Request, res: Response) => {
    const updated = await transactionService.adminUpdateTransaction(
      req.user!.id,
      req.params.id,
      req.body
    );
    res.json(updated);
  }
);

router.delete(
  "/transactions/:id",
  authenticateToken,
  authorizeAdmin,
  async (req: Request, res: Response) => {
    const deleted = await transactionService.adminDeleteTransaction(
      req.user!.id,
      req.params.id
    );
    res.json(deleted);
  }
);

export default router;

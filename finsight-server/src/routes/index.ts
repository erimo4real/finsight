import { Router } from "express";
import userRoutes from "./user.routes";
import transactionRoutes from "./transaction.routes";
import adminRoutes from "./admin.routes"; // ADDED: optional admin aggregate router
import { healthCheck } from "../controllers/health.controller";
import uploadRoutes from "./upload.routes";

const router = Router();

router.get("/health", healthCheck);
router.use("/users", userRoutes);
router.use("/transactions", transactionRoutes);
router.use("/admin", adminRoutes); // ADDED: optional mount - remove if you prefer admin endpoints inside user/transaction routes
router.use("/uploads", uploadRoutes);


export default router;

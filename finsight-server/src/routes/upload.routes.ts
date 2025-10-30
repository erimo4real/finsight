import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { uploadSingle } from "../middleware/multer.middleware";
import { uploadProfileImage, uploadTransactionAttachment } from "../controllers/upload.controller";

const router = Router();

// Upload profile image (authenticated users)
router.post(
  "/profile",
  authenticateToken,
  // multer instance created per field name
  (req, res, next) => uploadSingle("image")(req, res, next),
  uploadProfileImage
);

// Upload transaction receipt (authenticated users)
router.post(
  "/transaction",
  authenticateToken,
  (req, res, next) => uploadSingle("image")(req, res, next),
  uploadTransactionAttachment
);

export default router;

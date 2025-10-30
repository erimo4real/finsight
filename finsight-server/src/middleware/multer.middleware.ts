import multer from "multer";

// Use memory storage — we stream buffers to Cloudinary (no local temp files)
const storage = multer.memoryStorage();

export const uploadSingle = (fieldName: string) =>
  multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req, file, cb) => {
      const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (allowed.includes(file.mimetype)) cb(null, true);
      else cb(new Error("Only JPEG/PNG/WEBP images are allowed."));
    },
  }).single(fieldName);

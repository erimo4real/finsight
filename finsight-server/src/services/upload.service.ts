// ADDED: Cloudinary upload/delete wrapper
import cloudinary from "../config/cloudinary.config";
import streamifier from "streamifier";

type UploadResult = { url: string; publicId: string };

export class UploadService {
  async uploadBuffer(buffer: Buffer, folder = "finsight"): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (err: any, result: any) => {
          if (err) return reject(err);
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  async delete(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId);
      return true;
    } catch (err) {
      console.warn("Cloudinary delete failed:", err);
      return false;
    }
  }
}

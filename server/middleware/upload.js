import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

export const uploadMiddleware = (req, res, next) => {
  const uploader = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.fieldname === "avatar") {
        cb(null, /image\/(jpeg|png|gif|webp)/.test(file.mimetype));
      } else {
        cb(null, /\.(pdf|doc|docx)$/i.test(file.originalname));
      }
    },
  }).fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]);

  uploader(req, res, async (err) => {
    if (err) return next(err);

    try {
      if (req.files?.avatar?.[0]) {
        const file = req.files.avatar[0];
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "gidy/avatars", resource_type: "image" },
              (err, result) => (err ? reject(err) : resolve(result))
            )
            .end(file.buffer);
        });
        req.files.avatar[0].cloudinaryUrl = result.secure_url;
      }

      if (req.files?.resume?.[0]) {
        const file = req.files.resume[0];
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "gidy/resumes", resource_type: "raw" },
              (err, result) => (err ? reject(err) : resolve(result))
            )
            .end(file.buffer);
        });
        req.files.resume[0].cloudinaryUrl = result.secure_url;
      }

      next();
    } catch (e) {
      next(e);
    }
  });
};
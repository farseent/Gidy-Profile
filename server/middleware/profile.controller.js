import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = file.fieldname === "avatar"
      ? "uploads/avatars"
      : "uploads/resumes";
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = `${req.params.id}-${file.fieldname}-${Date.now()}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "avatar") {
    cb(null, /image\/(jpeg|png|gif|webp)/.test(file.mimetype));
  } else {
    cb(null, /\.(pdf|doc|docx)$/.test(path.extname(file.originalname).toLowerCase()));
  }
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })
  .fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]);

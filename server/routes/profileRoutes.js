import express from "express";
import {
  getProfile,
  createProfile,
  updateProfile,
  generateBio,
  updateSocialLinks,
} from "../controllers/profileController.js";
import { uploadMiddleware } from "../middleware/upload.js";

const router = express.Router();

router.post("/", createProfile);
router.get("/:id", getProfile);
router.put("/:id", uploadMiddleware, updateProfile);
router.post("/:id/generate-bio", generateBio);
router.patch("/:id/social-links", updateSocialLinks);

export default router;
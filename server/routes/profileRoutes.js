import express from "express";
import {
  getProfile,
  createProfile,
  updateProfile,
  generateBio,
  updateSocialLinks,
} from "../controllers/profileController.js";
import { upload } from "../middleware/profile.controller.js";

const router = express.Router();

router.post("/", createProfile);
router.get("/:id", getProfile);
router.put("/:id", upload, updateProfile);
router.post("/:id/generate-bio", generateBio);
router.patch("/:id/social-links", updateSocialLinks);

export default router;
import express from "express";
import {
  getProfile,
  createProfile,
  updateProfile,
  generateBio,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/", createProfile);
router.get("/:id", getProfile);
router.put("/:id", updateProfile);
router.post("/:id/generate-bio", generateBio);

export default router;
import express from "express";
import {
  getExperience,
  addExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js";

const router = express.Router();

router.route("/:id/experience")
  .get(getExperience)
  .post(addExperience);

router.route("/:id/experience/:expId")
  .put(updateExperience)
  .delete(deleteExperience);

export default router;
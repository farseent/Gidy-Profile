import express from "express";
import {
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation,
} from "../controllers/educationController.js";

const router = express.Router();

router.route("/:id/education")
  .get(getEducation)
  .post(addEducation);

router.route("/:id/education/:eduId")
  .put(updateEducation)
  .delete(deleteEducation);

export default router;
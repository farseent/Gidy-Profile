import express from "express";
import {
  getSkills,
  addSkill,
  deleteSkill,
  endorseSkill,
} from "../controllers/skillController.js";

const router = express.Router();

router.route("/:id/skills")
  .get(getSkills)
  .post(addSkill);

router.route("/:id/skills/:skillId")
  .delete(deleteSkill);

// Innovation: Skill Endorsement
router.post("/:id/skills/:skillId/endorse", endorseSkill);

export default router;
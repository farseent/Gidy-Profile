import express from "express";
import {
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
} from "../controllers/certificationController.js";

const router = express.Router();

router.route("/:id/certifications")
  .get(getCertifications)
  .post(addCertification);

router.route("/:id/certifications/:certId")
  .put(updateCertification)
  .delete(deleteCertification);

export default router;
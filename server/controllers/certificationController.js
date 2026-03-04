import Certification from "../models/Certification.js";
import { refreshProfileCompletion } from "../utils/profileCompletion.js";

// @desc    Get all certifications for a profile
// @route   GET /api/profile/:id/certifications
export const getCertifications = async (req, res) => {
  try {
    const certs = await Certification.find({ profileId: req.params.id }).sort({ issuedDate: -1 });
    res.json(certs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add certification
// @route   POST /api/profile/:id/certifications
export const addCertification = async (req, res) => {
  try {
    const cert = await Certification.create({ ...req.body, profileId: req.params.id });
    await refreshProfileCompletion(req.params.id);
    res.status(201).json(cert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update certification
// @route   PUT /api/profile/:id/certifications/:certId
export const updateCertification = async (req, res) => {
  try {
    const cert = await Certification.findOneAndUpdate(
      { _id: req.params.certId, profileId: req.params.id },
      { $set: req.body },
      { returnDocument: "after", runValidators: true }
    );
    if (!cert) return res.status(404).json({ message: "Certification not found" });
    await refreshProfileCompletion(req.params.id);
    res.json(cert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete certification
// @route   DELETE /api/profile/:id/certifications/:certId
export const deleteCertification = async (req, res) => {
  try {
    const cert = await Certification.findOneAndDelete({
      _id: req.params.certId,
      profileId: req.params.id,
    });
    if (!cert) return res.status(404).json({ message: "Certification not found" });
    await refreshProfileCompletion(req.params.id);
    res.json({ message: "Certification removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
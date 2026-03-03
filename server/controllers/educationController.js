import Education from "../models/Education.js";

// @desc    Get all education for a profile
// @route   GET /api/profile/:id/education
export const getEducation = async (req, res) => {
  try {
    const education = await Education.find({ profileId: req.params.id }).sort({ startDate: -1 });
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add education
// @route   POST /api/profile/:id/education
export const addEducation = async (req, res) => {
  try {
    const edu = await Education.create({ ...req.body, profileId: req.params.id });
    res.status(201).json(edu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update education
// @route   PUT /api/profile/:id/education/:eduId
export const updateEducation = async (req, res) => {
  try {
    const edu = await Education.findOneAndUpdate(
      { _id: req.params.eduId, profileId: req.params.id },
      { $set: req.body },
      { returnDocument: "after", runValidators: true }
    );
    if (!edu) return res.status(404).json({ message: "Education not found" });
    res.json(edu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete education
// @route   DELETE /api/profile/:id/education/:eduId
export const deleteEducation = async (req, res) => {
  try {
    const edu = await Education.findOneAndDelete({
      _id: req.params.eduId,
      profileId: req.params.id,
    });
    if (!edu) return res.status(404).json({ message: "Education not found" });
    res.json({ message: "Education removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
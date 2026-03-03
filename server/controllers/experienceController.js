import Experience from "../models/Experience.js";

// @desc    Get all experience for a profile
// @route   GET /api/profile/:id/experience
export const getExperience = async (req, res) => {
  try {
    const experience = await Experience.find({ profileId: req.params.id }).sort({ startDate: -1 });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add experience
// @route   POST /api/profile/:id/experience
export const addExperience = async (req, res) => {
  try {
    const exp = await Experience.create({ ...req.body, profileId: req.params.id });
    res.status(201).json(exp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update experience
// @route   PUT /api/profile/:id/experience/:expId
export const updateExperience = async (req, res) => {
  try {
    const exp = await Experience.findOneAndUpdate(
      { _id: req.params.expId, profileId: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!exp) return res.status(404).json({ message: "Experience not found" });
    res.json(exp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete experience
// @route   DELETE /api/profile/:id/experience/:expId
export const deleteExperience = async (req, res) => {
  try {
    const exp = await Experience.findOneAndDelete({
      _id: req.params.expId,
      profileId: req.params.id,
    });
    if (!exp) return res.status(404).json({ message: "Experience not found" });
    res.json({ message: "Experience removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
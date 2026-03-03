import Skill from "../models/Skill.js";

// @desc    Get all skills for a profile
// @route   GET /api/profile/:id/skills
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ profileId: req.params.id });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a skill
// @route   POST /api/profile/:id/skills
export const addSkill = async (req, res) => {
  try {
    const exists = await Skill.findOne({ profileId: req.params.id, name: req.body.name });
    if (exists) return res.status(400).json({ message: "Skill already added" });

    const skill = await Skill.create({ ...req.body, profileId: req.params.id });
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/profile/:id/skills/:skillId
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({
      _id: req.params.skillId,
      profileId: req.params.id,
    });
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json({ message: "Skill removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Endorse a skill (Innovation Feature)
// @route   POST /api/profile/:id/skills/:skillId/endorse
export const endorseSkill = async (req, res) => {
  try {
    const { endorsedBy, message } = req.body;
    if (!endorsedBy) return res.status(400).json({ message: "Endorser name is required" });

    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.skillId, profileId: req.params.id },
      {
        $push: { endorsements: { endorsedBy, message } },
        $inc: { endorsementCount: 1 },
      },
      { new: true }
    );

    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json(skill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
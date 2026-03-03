import Profile from "../models/Profile.js";
import Experience from "../models/Experience.js";
import Education from "../models/Education.js";
import Skill from "../models/Skill.js";
import Certification from "../models/Certification.js";
import { generateAIBio } from "../utils/generateBio.js";
import { calculateProfileCompletion } from "../utils/profileCompletion.js";

// @desc    Get full profile with all related data
// @route   GET /api/profile/:id
// @access  Public
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const [experience, education, skills, certifications] = await Promise.all([
      Experience.find({ profileId: profile._id }).sort({ startDate: -1 }),
      Education.find({ profileId: profile._id }).sort({ startDate: -1 }),
      Skill.find({ profileId: profile._id }),
      Certification.find({ profileId: profile._id }).sort({ issuedDate: -1 }),
    ]);

    res.json({ profile, experience, education, skills, certifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new profile
// @route   POST /api/profile
// @access  Public
export const createProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const exists = await Profile.findOne({ email });
    if (exists) return res.status(400).json({ message: "Profile already exists for this email" });

    const profile = await Profile.create(req.body);
    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update profile
// @route   PUT /api/profile/:id
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    // Merge nested socialLinks / stats safely
    if (req.body.socialLinks) {
      req.body.socialLinks = { ...profile.socialLinks.toObject(), ...req.body.socialLinks };
    }

    const updated = await Profile.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // Recalculate completion percentage
    const skills = await Skill.find({ profileId: profile._id });
    const experience = await Experience.find({ profileId: profile._id });
    const education = await Education.find({ profileId: profile._id });

    const completionPercent = calculateProfileCompletion(updated, { skills, experience, education });
    await Profile.findByIdAndUpdate(req.params.id, { profileCompletionPercent: completionPercent });
    updated.profileCompletionPercent = completionPercent;

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Generate AI bio from skills and experience (Innovation)
// @route   POST /api/profile/:id/generate-bio
// @access  Private
export const generateBio = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const skills = await Skill.find({ profileId: profile._id });
    const experience = await Experience.find({ profileId: profile._id });

    const aiBio = await generateAIBio({
      name: profile.name,
      title: profile.title,
      location: profile.location,
      skills: skills.map((s) => s.name),
      experience: experience.map((e) => ({ title: e.title, company: e.company })),
      careerGoals: profile.careerGoals,
    });

    // Cache the generated bio
    await Profile.findByIdAndUpdate(req.params.id, {
      aiBio,
      aiBioGeneratedAt: new Date(),
    });

    res.json({ aiBio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
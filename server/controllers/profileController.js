import Profile from "../models/Profile.js";
import Experience from "../models/Experience.js";
import Education from "../models/Education.js";
import Skill from "../models/Skill.js";
import Certification from "../models/Certification.js";
import { generateAIBio } from "../utils/generateBio.js";
import { refreshProfileCompletion } from "../utils/profileCompletion.js";

// ─── Get Profile ──────────────────────────────────────────────────────────────

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

// ─── Create Profile ───────────────────────────────────────────────────────────

export const createProfile = async (req, res) => {
  try {
    const { email } = req.body;
    const exists = await Profile.findOne({ email });
    if (exists)
      return res
        .status(400)
        .json({ message: "Profile already exists for this email" });

    const profile = await Profile.create(req.body);
    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─── Update Profile ───────────────────────────────────────────────────────────

export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const { firstName, lastName, location, bio, careerGoals, socialLinks } =
      req.body;

    const updates = {};
    if (firstName   !== undefined) updates.firstName   = firstName;
    if (lastName    !== undefined) updates.lastName     = lastName;
    if (location    !== undefined) updates.location     = location;
    if (bio         !== undefined) updates.bio          = bio;
    if (careerGoals !== undefined) updates.careerGoals  = careerGoals;

    if (socialLinks) {
      updates.socialLinks = {
        ...profile.socialLinks.toObject(),
        ...JSON.parse(socialLinks),
      };
    }

    // Cloudinary URLs — set by uploadMiddleware
    if (req.files?.avatar?.[0]) {
      updates.avatarUrl = req.files.avatar[0].cloudinaryUrl;
    }
    if (req.files?.resume?.[0]) {
      updates.resumeUrl = req.files.resume[0].cloudinaryUrl;
    }

    const updated = await Profile.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { returnDocument: "after", runValidators: true }
    );

    const completionPercent = await refreshProfileCompletion(profile._id);
    updated.profileCompletionPercent = completionPercent;

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─── Generate AI Bio ──────────────────────────────────────────────────────────

export const generateBio = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const [skills, experience] = await Promise.all([
      Skill.find({ profileId: profile._id }),
      Experience.find({ profileId: profile._id }),
    ]);

    const fullName =
      profile.firstName && profile.lastName
        ? `${profile.firstName} ${profile.lastName}`
        : profile.firstName || profile.lastName || "Professional";

    const aiBio = await generateAIBio({
      name:        fullName,
      title:       profile.title       || "",
      location:    profile.location    || "",
      skills:      skills.map((s) => s.name),
      experience:  experience.map((e) => ({ title: e.title, company: e.company })),
      careerGoals: profile.careerGoals || "",
    });

    await Profile.findByIdAndUpdate(req.params.id, {
      aiBio,
      aiBioGeneratedAt: new Date(),
    });

    res.json({ aiBio });
  } catch (error) {
    console.error("[generateBio] error:", error?.message ?? error);
    res.status(500).json({ message: error?.message ?? "Failed to generate bio" });
  }
};

// ─── Update Social Links ──────────────────────────────────────────────────────

const ALLOWED_SOCIAL_KEYS = ["github", "linkedin", "twitter", "website"];

export const updateSocialLinks = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const setFields = {};
    for (const key of ALLOWED_SOCIAL_KEYS) {
      if (req.body[key] !== undefined) {
        setFields[`socialLinks.${key}`] = req.body[key].trim();
      }
    }

    if (Object.keys(setFields).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid social link fields provided" });
    }

    const updated = await Profile.findByIdAndUpdate(
      req.params.id,
      { $set: setFields },
      { returnDocument: "after", runValidators: true }
    );

    res.json({ socialLinks: updated.socialLinks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
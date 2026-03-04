import Profile from "../models/Profile.js";
import Experience from "../models/Experience.js";
import Education from "../models/Education.js";
import Skill from "../models/Skill.js";
import Certification from "../models/Certification.js";
import { generateAIBio } from "../utils/generateBio.js";
import { calculateProfileCompletion, refreshProfileCompletion } from "../utils/profileCompletion.js";

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const makeAbsolute = (url) => {
      if (!url || url.startsWith("http")) return url;
      const base = process.env.SERVER_URL || `${req.protocol}://${req.get("host")}`;
      return base + url;
    };
    profile.avatarUrl = makeAbsolute(profile.avatarUrl);
    profile.resumeUrl = makeAbsolute(profile.resumeUrl);

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

export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const { firstName, lastName, location, bio, title, careerGoals, socialLinks } = req.body;

    const updates = {};
    if (firstName   !== undefined) updates.firstName   = firstName;
    if (lastName    !== undefined) updates.lastName     = lastName;
    if (location    !== undefined) updates.location     = location;
    if (bio         !== undefined) updates.bio          = bio;
    if (title       !== undefined) updates.title        = title;
    if (careerGoals !== undefined) updates.careerGoals  = careerGoals;

    if (socialLinks) {
      updates.socialLinks = { ...profile.socialLinks.toObject(), ...JSON.parse(socialLinks) };
    }
    const publicBase =
      process.env.SERVER_URL || `${req.protocol}://${req.get("host")}`;

    if (req.files?.avatar?.[0]) {
      const rel = req.files.avatar[0].path.replace(/\\/g, "/");
      console.log("avatar saved to", req.files.avatar[0].path);
      updates.avatarUrl = `${publicBase}/${rel}`;
    }
    if (req.files?.resume?.[0]) {
      const rel = req.files.resume[0].path.replace(/\\/g, "/");
      console.log("resume saved to", req.files.resume[0].path);
      updates.resumeUrl = `${publicBase}/${rel}`;
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
      return res.status(400).json({ message: "No valid social link fields provided" });
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
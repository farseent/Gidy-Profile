/**
 * Calculates profile completion percentage based on filled fields.
 * @param {Object} profile - Profile document
 * @param {Object} related - { skills, experience, education, certifications }
 * @returns {number} Completion percentage (0-100)
 */
export const calculateProfileCompletion = (
  profile,
  { skills = [], experience = [], education = [], certifications = [] } = {}
) => {
  // weights are chosen to add up to 100; certifications added with a small portion
  const checks = [
    { label: "Name",        value: !!profile.name,                  weight: 10 },
    { label: "Bio",         value: !!profile.bio,                   weight: 10 },
    { label: "Avatar",      value: !!profile.avatarUrl,             weight: 10 },
    { label: "Location",    value: !!profile.location,              weight: 10 },
    { label: "Email",       value: !!profile.email,                 weight: 10 },
    { label: "Resume",      value: !!profile.resumeUrl,             weight: 10 },
    { label: "Skills",      value: skills.length > 0,               weight: 10 },
    { label: "Experience",  value: experience.length > 0,           weight: 10 },
    { label: "Education",   value: education.length > 0,            weight: 10 },
    { label: "Certifications", value: certifications.length > 0,    weight: 10 },
  ];

  const total = checks.reduce((sum, c) => sum + c.weight, 0);
  const earned = checks.filter((c) => c.value).reduce((sum, c) => sum + c.weight, 0);

  return Math.round((earned / total) * 100);
};

// convenience helper used by controllers when related data changes
import Profile from "../models/Profile.js";
import Skill from "../models/Skill.js";
import Experience from "../models/Experience.js";
import Education from "../models/Education.js";
import Certification from "../models/Certification.js";

/**
 * Fetches the profile and all related records, recalculates
 * the completion percent, saves it back to the profile document and returns it.
 * @param {String|ObjectId} profileId
 * @returns {Promise<number>} new completion percentage
 */
export const refreshProfileCompletion = async (profileId) => {
  const profile = await Profile.findById(profileId);
  if (!profile) throw new Error("Profile not found when refreshing completion");

  const [skills, experience, education, certifications] = await Promise.all([
    Skill.find({ profileId }),
    Experience.find({ profileId }),
    Education.find({ profileId }),
    Certification.find({ profileId }),
  ]);

  const completion = calculateProfileCompletion(profile, { skills, experience, education, certifications });
  profile.profileCompletionPercent = completion;
  await profile.save();
  return completion;
};
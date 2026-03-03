/**
 * Calculates profile completion percentage based on filled fields.
 * @param {Object} profile - Profile document
 * @param {Object} related - { skills, experience, education }
 * @returns {number} Completion percentage (0-100)
 */
export const calculateProfileCompletion = (profile, { skills, experience, education }) => {
  const checks = [
    { label: "Name",        value: !!profile.name,                  weight: 15 },
    { label: "Bio",         value: !!profile.bio,                   weight: 15 },
    { label: "Avatar",      value: !!profile.avatarUrl,             weight: 10 },
    { label: "Location",    value: !!profile.location,              weight: 10 },
    { label: "Title",       value: !!profile.title,                 weight: 5  },
    { label: "Email",       value: !!profile.email,                 weight: 10 },
    { label: "Resume",      value: !!profile.resumeUrl,             weight: 10 },
    { label: "Skills",      value: skills.length > 0,               weight: 10 },
    { label: "Experience",  value: experience.length > 0,           weight: 10 },
    { label: "Education",   value: education.length > 0,            weight: 5  },
  ];

  const total = checks.reduce((sum, c) => sum + c.weight, 0);
  const earned = checks.filter((c) => c.value).reduce((sum, c) => sum + c.weight, 0);

  return Math.round((earned / total) * 100);
};
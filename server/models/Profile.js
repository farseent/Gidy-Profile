import mongoose from "mongoose";

const socialLinksSchema = new mongoose.Schema({
  github: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  twitter: { type: String, default: "" },
  website: { type: String, default: "" },
});

const profileStatsSchema = new mongoose.Schema({
  league: { type: String, default: "Bronze" },
  rank: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
});

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, default: "" },          
    location: { type: String, default: "" },        
    bio: { type: String, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true },
    avatarUrl: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    socialLinks: { type: socialLinksSchema, default: () => ({}) },
    stats: { type: profileStatsSchema, default: () => ({}) },
    careerGoals: { type: String, default: "" },
    profileCompletionPercent: { type: Number, default: 0, min: 0, max: 100 },

    // Innovation: AI-generated bio cache
    aiBio: { type: String, default: "" },
    aiBioGeneratedAt: { type: Date },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
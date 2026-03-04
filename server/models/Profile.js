import mongoose from "mongoose";

const socialLinksSchema = new mongoose.Schema({
  github:   { type: String, default: "" },
  linkedin: { type: String, default: "" },
  twitter:  { type: String, default: "" },
  website:  { type: String, default: "" },
});

const profileStatsSchema = new mongoose.Schema({
  league: { type: String, default: "Bronze" },
  rank:   { type: Number, default: 0 },
  points: { type: Number, default: 0 },
});

const profileSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },

    location: { type: String, default: "" },
    bio:      { type: String, default: "", maxlength: 500 },

    email: { type: String, required: true, unique: true, lowercase: true, immutable: true },

    avatarUrl: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },

    socialLinks: { type: socialLinksSchema,     default: () => ({}) },
    stats:       { type: profileStatsSchema,    default: () => ({}) },

    careerGoals: { type: String, default: "" },
    profileCompletionPercent: { type: Number, default: 0, min: 0, max: 100 },

    aiBio:            { type: String, default: "" },
    aiBioGeneratedAt: { type: Date },
  },
  { timestamps: true }
);

profileSchema.virtual("name").get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
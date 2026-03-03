import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    title: { type: String, required: true, trim: true },      // e.g. "Intern"
    company: { type: String, required: true, trim: true },    // e.g. "Bridgeon"
    location: { type: String, default: "" },                  // e.g. "Kakkanchery, Kozhikode"
    startDate: { type: Date, required: true },
    endDate: { type: Date },                                  // null = present
    isCurrent: { type: Boolean, default: false },
    description: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const Experience = mongoose.model("Experience", experienceSchema);
export default Experience;
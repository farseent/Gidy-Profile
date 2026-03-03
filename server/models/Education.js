import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    degree: { type: String, required: true, trim: true },       // e.g. "B.Tech - Information Technology"
    institution: { type: String, required: true, trim: true },  // e.g. "Institute of Engineering and Technology"
    university: { type: String, default: "" },                  // e.g. "Calicut University"
    startDate: { type: Date, required: true },
    endDate: { type: Date },                                    // null = present
    isCurrent: { type: Boolean, default: false },
    grade: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const Education = mongoose.model("Education", educationSchema);
export default Education;
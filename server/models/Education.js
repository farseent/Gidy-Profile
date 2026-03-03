import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    profileId:    { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
    college:      { type: String, required: true, trim: true },   // e.g. "IET Thrissur"
    degree:       { type: String, required: true, trim: true },   // e.g. "B.Tech"
    fieldOfStudy: { type: String, required: true, trim: true },   // e.g. "Information Technology"
    location:     { type: String, required: true, trim: true },   // e.g. "Thrissur, Kerala"
    startDate:    { type: Date,   required: true },
    endDate:      { type: Date,   default: null },                 // null = present / not completed
    isCurrent:    { type: Boolean, default: false },
    logoUrl:      { type: String, default: "" },
  },
  { timestamps: true }
);

const Education = mongoose.model("Education", educationSchema);
export default Education;

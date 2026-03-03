import mongoose from "mongoose";

const endorsementSchema = new mongoose.Schema({
  endorsedBy: { type: String, required: true },   // name of endorser
  message: { type: String, default: "" },
  endorsedAt: { type: Date, default: Date.now },
});

const skillSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    name: { type: String, required: true, trim: true },   // e.g. "React"
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Intermediate",
    },
    // Innovation: Skill Endorsements
    endorsements: { type: [endorsementSchema], default: [] },
    endorsementCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Skill = mongoose.model("Skill", skillSchema);
export default Skill;
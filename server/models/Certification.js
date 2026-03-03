import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    title: { type: String, required: true, trim: true },   // e.g. "Internship Certificate"
    issuer: { type: String, required: true, trim: true },  // e.g. "Bridgeon"
    certificateUrl: { type: String, default: "" },
    issuedDate: { type: Date },
    logoUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const Certification = mongoose.model("Certification", certificationSchema);
export default Certification;
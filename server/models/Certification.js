import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
  {
    profileId:      { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
    title:          { type: String, required: true, trim: true },  // e.g. "AWS Certified Developer"
    issuer:         { type: String, required: true, trim: true },  // e.g. "Amazon Web Services"
    certificateUrl: { type: String, default: "" },
    certificateId:  { type: String, default: "" },                 // e.g. "ABC-12345"
    issuedDate:     { type: Date },
    expiryDate:     { type: Date },
    description:    { type: String, default: "", maxlength: 200 },
    logoUrl:        { type: String, default: "" },
  },
  { timestamps: true }
);

const Certification = mongoose.model("Certification", certificationSchema);
export default Certification;
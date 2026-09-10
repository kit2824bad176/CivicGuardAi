import mongoose, { Schema, Document } from "mongoose";

export interface IEvidence extends Document {
  caseId: mongoose.Types.ObjectId;
  uploadedById?: mongoose.Types.ObjectId;
  fileUrl: string;
  fileType: string; // image/jpeg, video/mp4
  fileHash: string; // SHA-256 tamper-proof hash
  location?: {
    coordinates?: [number, number];
  };
  createdAt: Date;
}

const EvidenceSchema: Schema = new Schema({
  caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true },
  uploadedById: { type: Schema.Types.ObjectId, ref: "User" },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  fileHash: { type: String, required: true }, // The Step 15 requirement
  location: {
    coordinates: {
      type: [Number],
      index: "2dsphere"
    }
  }
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.models.Evidence || mongoose.model<IEvidence>("Evidence", EvidenceSchema);

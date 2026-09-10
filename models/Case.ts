import mongoose, { Schema, Document } from "mongoose";

export interface ICase extends Document {
  title: string;
  description: string;
  category: string;
  location: {
    address: string;
    coordinates?: [number, number]; // [longitude, latitude]
  };
  status: "Pending Review" | "Forwarded to Police" | "Assigned Officer" | "Investigation in Progress" | "Resolved";
  citizenId: mongoose.Types.ObjectId;
  assignedOfficerId?: mongoose.Types.ObjectId;
  priorityScore?: "Low" | "Medium" | "High";
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CaseSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: {
    address: { type: String },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: "2dsphere"
    }
  },
  status: { 
    type: String, 
    enum: ["Pending Review", "Forwarded to Police", "Assigned Officer", "Investigation in Progress", "Resolved"],
    default: "Pending Review"
  },
  citizenId: { type: Schema.Types.ObjectId, ref: "User", required: false }, // false if anonymous
  assignedOfficerId: { type: Schema.Types.ObjectId, ref: "User" },
  priorityScore: { type: String, enum: ["Low", "Medium", "High"] },
  isAnonymous: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Case || mongoose.model<ICase>("Case", CaseSchema);

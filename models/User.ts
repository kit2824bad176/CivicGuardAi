import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "Citizen" | "Police Officer" | "Admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { 
    type: String, 
    enum: ["Citizen", "Police Officer", "Admin"], 
    default: "Citizen" 
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  caseId?: mongoose.Types.ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  caseId: { type: Schema.Types.ObjectId, ref: "Case" },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);

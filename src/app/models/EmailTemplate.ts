import mongoose, { Document, Schema } from "mongoose";

export interface IEmailTemplate extends Document {
  name: string;
  subject: string;
  message: string;
  type: string;
  status: 'active' | 'draft' | 'inactive';
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EmailTemplateSchema = new Schema<IEmailTemplate>(
  {
    name: {
      type: String,
      required: [true, "Template name is required"],
      trim: true,
      maxlength: [200, "Template name cannot exceed 200 characters"],
    },
    subject: {
      type: String,
      required: [true, "Email subject is required"],
      trim: true,
      maxlength: [300, "Subject cannot exceed 300 characters"],
    },
    message: {
      type: String,
      required: [true, "Email message is required"],
      maxlength: [10000, "Message cannot exceed 10000 characters"],
    },
    type: {
      type: String,
      required: [true, "Template type is required"],
      enum: [
        "Lead Follow-up",
        "Welcome",
        "Thank You", 
        "Appointment Confirmation",
        "Project Update",
        "Quote Request",
        "Newsletter",
        "Promotional"
      ],
    },
    status: {
      type: String,
      enum: ["active", "draft", "inactive"],
      default: "active",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
EmailTemplateSchema.index({ type: 1, status: 1 });
EmailTemplateSchema.index({ createdBy: 1 });

export default mongoose.models.EmailTemplate ||
  mongoose.model<IEmailTemplate>("EmailTemplate", EmailTemplateSchema);
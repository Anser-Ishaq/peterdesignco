import mongoose, { Document, Schema } from "mongoose";

export interface IJobApplication extends Document {
  careerId: mongoose.Types.ObjectId;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  currentPosition?: string;
  yearsOfExperience?: number;
  expectedSalary?: number;
  resumeUrl?: string;
  coverLetter?: string;
  applicationStatus: "pending" | "reviewed" | "shortlisted" | "interviewed" | "rejected" | "hired";
  appliedAt: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    careerId: {
      type: Schema.Types.ObjectId,
      ref: "Career",
      required: true,
    },
    applicantName: {
      type: String,
      required: true,
      trim: true,
    },
    applicantEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    applicantPhone: {
      type: String,
      trim: true,
    },
    currentPosition: {
      type: String,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
    },
    expectedSalary: {
      type: Number,
      min: 0,
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
    coverLetter: {
      type: String,
      trim: true,
    },
    applicationStatus: {
      type: String,
      enum: ["pending", "reviewed", "shortlisted", "interviewed", "rejected", "hired"],
      default: "pending",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
JobApplicationSchema.index({ careerId: 1, appliedAt: -1 });
JobApplicationSchema.index({ applicationStatus: 1, appliedAt: -1 });
JobApplicationSchema.index({ applicantEmail: 1 });
JobApplicationSchema.index({ appliedAt: -1 });

// Prevent duplicate applications from same email for same career
JobApplicationSchema.index({ careerId: 1, applicantEmail: 1 }, { unique: true });

export default mongoose.models.JobApplication ||
  mongoose.model<IJobApplication>("JobApplication", JobApplicationSchema);
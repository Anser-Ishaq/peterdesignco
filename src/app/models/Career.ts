import mongoose, { Document, Schema } from "mongoose";

export interface ICareer extends Document {
  title: string;
  slug: string;
  department: string;
  location: string;
  workMode: "onsite" | "remote" | "hybrid";
  employmentType: "full time" | "part time" | "contract" | "internship";
  experienceLevel: "entry" | "mid" | "senior" | "executive";
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: "active" | "inactive" | "draft" | "closed";
  postedAt: Date;
  applyBy: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CareerSchema = new Schema<ICareer>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    workMode: {
      type: String,
      enum: ["onsite", "remote", "hybrid"],
      required: true,
    },
    employmentType: {
      type: String,
      enum: ["full time", "part time", "contract", "internship"],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "executive"],
      required: true,
    },
    salaryRange: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        required: true,
        default: "PKR",
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    requirements: [String],
    responsibilities: [String],
    status: {
      type: String,
      enum: ["active", "inactive", "draft", "closed"],
      default: "draft",
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
    applyBy: {
      type: Date,
      required: true,
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

// Indexes for better query performance
CareerSchema.index({ slug: 1 }, { unique: true });
CareerSchema.index({ status: 1, postedAt: -1 });
CareerSchema.index({ department: 1, status: 1 });
CareerSchema.index({ experienceLevel: 1, status: 1 });

export default mongoose.models.Career ||
  mongoose.model<ICareer>("Career", CareerSchema);
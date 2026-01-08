import mongoose, { Document, Schema } from "mongoose";

// Ensure User model is registered before Team model
import './User';

export interface ITeam extends Document {
  name: string;
  slug: string;
  role: string;
  position: string;
  image: {
    url: string;
    publicId: string;
    alt?: string;
  };
  bio: string[];
  socialLinks: {
    linkedin?: string | null;
    instagram?: string | null;
    facebook?: string | null;
  };
  order: number;
  status: 'active' | 'inactive';
  createdBy: mongoose.Types.ObjectId; // Reference to User who created this
  updatedBy: mongoose.Types.ObjectId; // Reference to User who last updated this
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ['architecture', 'interior', 'construction', 'project-management', 'sales', 'marketing', 'administration'],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
      maxlength: [100, "Position cannot exceed 100 characters"],
    },
    image: {
      url: {
        type: String,
        required: [true, "Image URL is required"],
      },
      publicId: {
        type: String,
        required: [true, "Image public ID is required"],
      },
      alt: {
        type: String,
        default: "",
      },
    },
    bio: {
      type: [String],
      default: [],
      validate: {
        validator: function(bio: string[]) {
          return bio.every(paragraph => paragraph.length <= 500);
        },
        message: "Each bio paragraph cannot exceed 500 characters",
      },
    },
    socialLinks: {
      linkedin: {
        type: String,
        default: null,
        validate: {
          validator: function(url: string) {
            if (!url) return true;
            return /^https?:\/\/(www\.)?linkedin\.com\//.test(url);
          },
          message: "Please provide a valid LinkedIn URL",
        },
      },
      instagram: {
        type: String,
        default: null,
        validate: {
          validator: function(url: string) {
            if (!url) return true;
            return /^https?:\/\/(www\.)?instagram\.com\//.test(url);
          },
          message: "Please provide a valid Instagram URL",
        },
      },
      facebook: {
        type: String,
        default: null,
        validate: {
          validator: function(url: string) {
            if (!url) return true;
            return /^https?:\/\/(www\.)?facebook\.com\//.test(url);
          },
          message: "Please provide a valid Facebook URL",
        },
      },
    },
    order: {
      type: Number,
      default: 0,
      min: [0, "Order cannot be negative"],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "Created by user is required"],
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "Updated by user is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
TeamSchema.index({ status: 1, order: 1 });
TeamSchema.index({ role: 1 });
TeamSchema.index({ createdBy: 1 });

export default mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema);
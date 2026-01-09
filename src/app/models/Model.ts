import mongoose, { Document, Schema } from "mongoose";

export interface IModel extends Document {
  name: string;
  slug: string;
  category: string;
  modelFile: {
    url: string;
    publicId: string;
    size: number; // in bytes
  };
  thumbnail?: {
    url: string;
    publicId: string;
  };
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  description: string;
  tags: string[];
  isWallMounted: boolean;
  status: 'active' | 'inactive' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

const ModelSchema = new Schema<IModel>(
  {
    name: {
      type: String,
      required: [true, "Model name is required"],
      trim: true,
      maxlength: [200, "Model name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Model slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["chair", "table", "sofa", "bed", "shelf", "tv", "cabinet", "lamp", "plant", "decoration", "other"],
    },
    modelFile: {
      url: {
        type: String,
        required: [true, "Model file URL is required"],
      },
      publicId: {
        type: String,
        required: [true, "Model file public ID is required"],
      },
      size: {
        type: Number,
        required: [true, "Model file size is required"],
        max: [5 * 1024 * 1024, "Model file size cannot exceed 5MB"], // 5MB limit
      },
    },
    thumbnail: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },
    dimensions: {
      width: {
        type: Number,
        required: [true, "Width is required"],
        min: [0.1, "Width must be at least 0.1"],
      },
      height: {
        type: Number,
        required: [true, "Height is required"],
        min: [0.1, "Height must be at least 0.1"],
      },
      depth: {
        type: Number,
        required: [true, "Depth is required"],
        min: [0.1, "Depth must be at least 0.1"],
      },
    },
    description: {
      type: String,
      required: [true, "Model description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    tags: [{
      type: String,
      trim: true,
    }],
    isWallMounted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
ModelSchema.index({ category: 1, status: 1 });
ModelSchema.index({ tags: 1 });

export default mongoose.models.Model ||
  mongoose.model<IModel>("Model", ModelSchema);
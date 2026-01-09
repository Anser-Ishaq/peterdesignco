import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: string;
  thumbnail: {
    url: string;
    alt: string;
  };
  images: Array<{
    url: string;
    alt: string;
  }>;
  rating: number;
  pricing: {
    original: number;
    sale: number | null;
    discountPercent: number | null;
  };
  stock: {
    quantity: number;
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
  };
  quality: 'Basic' | 'Standard' | 'Premium' | 'Luxury';
  description: string;
  sku: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["furniture", "office", "living-room", "dining", "bedroom", "outdoor"],
    },
    thumbnail: {
      url: {
        type: String,
        required: [true, "Thumbnail URL is required"],
      },
      alt: {
        type: String,
        required: [true, "Thumbnail alt text is required"],
      },
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          required: true,
        },
      },
    ],
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
      default: 0,
    },
    pricing: {
      original: {
        type: Number,
        required: [true, "Original price is required"],
        min: [0, "Price cannot be negative"],
      },
      sale: {
        type: Number,
        min: [0, "Sale price cannot be negative"],
        default: null,
      },
      discountPercent: {
        type: Number,
        min: [0, "Discount cannot be negative"],
        max: [100, "Discount cannot exceed 100%"],
        default: null,
      },
    },
    stock: {
      quantity: {
        type: Number,
        required: [true, "Stock quantity is required"],
        min: [0, "Stock quantity cannot be negative"],
      },
      status: {
        type: String,
        enum: ["in_stock", "low_stock", "out_of_stock"],
        default: "in_stock",
      },
    },
    quality: {
      type: String,
      enum: ["Basic", "Standard", "Premium", "Luxury"],
      required: [true, "Quality level is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      uppercase: true,
      trim: true,
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
ProductSchema.index({ category: 1, status: 1 });

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
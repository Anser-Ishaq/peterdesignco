import mongoose, { Document, Schema } from "mongoose";

export interface ILead extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  addedAt: Date;
  status: 'active' | 'ordered' | 'removed';
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "ordered", "removed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate entries and improve query performance
LeadSchema.index({ userId: 1, productId: 1 }, { unique: true });
LeadSchema.index({ userId: 1, status: 1 });

export default mongoose.models.Lead ||
  mongoose.model<ILead>("Lead", LeadSchema);
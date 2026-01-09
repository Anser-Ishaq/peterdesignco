import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Lead from "@/app/models/Lead";
import Product from "@/app/models/Product";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// PUT /api/leads/[id] - Update lead quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    // Ensure models are registered
    Product;
    Lead;

    // Check authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid lead ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    // Find the lead and ensure it belongs to the authenticated user
    const lead = await Lead.findOne({
      _id: id,
      userId: decoded.userId,
      status: "active",
    }).populate("productId");

    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Cart item not found" },
        { status: 404 }
      );
    }

    const product = lead.productId as any;

    // Check if requested quantity is available
    if (quantity > product.stock.quantity) {
      return NextResponse.json(
        { success: false, error: `Only ${product.stock.quantity} items available in stock` },
        { status: 400 }
      );
    }

    // Update quantity
    lead.quantity = quantity;
    await lead.save();

    const updatedLead = await Lead.findById(lead._id)
      .populate("productId", "name slug thumbnail pricing stock quality category");

    return NextResponse.json({
      success: true,
      data: updatedLead,
      message: "Cart updated successfully",
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

// DELETE /api/leads/[id] - Remove item from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Check authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid lead ID" },
        { status: 400 }
      );
    }

    // Find and remove the lead, ensuring it belongs to the authenticated user
    const lead = await Lead.findOneAndUpdate(
      {
        _id: id,
        userId: decoded.userId,
        status: "active",
      },
      { status: "removed" },
      { new: true }
    );

    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Cart item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove cart item" },
      { status: 500 }
    );
  }
}
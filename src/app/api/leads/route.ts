import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Lead from "@/app/models/Lead";
import Product from "@/app/models/Product";
import User from "@/app/models/User";
import jwt from "jsonwebtoken";

// GET /api/leads - Get user's cart items (leads)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Ensure models are registered
    User;
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active";

    // Get user's leads with populated product data
    const leads = await Lead.find({
      userId: decoded.userId,
      status,
    })
      .populate("productId", "name slug thumbnail pricing stock quality category")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: leads,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}

// POST /api/leads - Add product to cart (create lead)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Ensure models are registered
    User;
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

    // Only users with "User" role can add to cart
    if (decoded.role !== "User") {
      return NextResponse.json(
        { success: false, error: "Only User can add products to cart" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Verify product exists and is active
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Product is not available" },
        { status: 400 }
      );
    }

    // Check if product is in stock
    if (product.stock.status === "out_of_stock") {
      return NextResponse.json(
        { success: false, error: "Product is out of stock" },
        { status: 400 }
      );
    }

    // Check if quantity is available
    if (quantity > product.stock.quantity) {
      return NextResponse.json(
        { success: false, error: `Only ${product.stock.quantity} items available in stock` },
        { status: 400 }
      );
    }

    // Check if product is already in user's cart
    const existingLead = await Lead.findOne({
      userId: decoded.userId,
      productId,
      status: "active",
    });

    if (existingLead) {
      // Update quantity if product already in cart
      const newQuantity = existingLead.quantity + quantity;
      
      if (newQuantity > product.stock.quantity) {
        return NextResponse.json(
          { success: false, error: `Cannot add more items. Only ${product.stock.quantity} available in stock` },
          { status: 400 }
        );
      }

      existingLead.quantity = newQuantity;
      await existingLead.save();

      const updatedLead = await Lead.findById(existingLead._id)
        .populate("productId", "name slug thumbnail pricing stock quality category");

      return NextResponse.json({
        success: true,
        data: updatedLead,
        message: "Cart updated successfully",
      });
    } else {
      // Create new lead
      const lead = new Lead({
        userId: decoded.userId,
        productId,
        quantity,
      });

      await lead.save();

      const populatedLead = await Lead.findById(lead._id)
        .populate("productId", "name slug thumbnail pricing stock quality category");

      return NextResponse.json({
        success: true,
        data: populatedLead,
        message: "Product added to cart successfully",
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Product already in cart" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to add product to cart" },
      { status: 500 }
    );
  }
}
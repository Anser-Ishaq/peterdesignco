import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { ensureModelsRegistered, Career, User } from "@/app/lib/models";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// GET /api/careers/[id] - Get single career
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    ensureModelsRegistered();

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid career ID" },
        { status: 400 }
      );
    }

    const career = await Career.findById(id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!career) {
      return NextResponse.json(
        { success: false, error: "Career not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: career,
    });
  } catch (error) {
    console.error("Error fetching career:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch career" },
      { status: 500 }
    );
  }
}

// PUT /api/careers/[id] - Update career (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    ensureModelsRegistered();

    // Check authentication and admin role
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

    if (decoded.role !== "Admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid career ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate salary range if provided
    if (body.salaryRange && body.salaryRange.min > body.salaryRange.max) {
      return NextResponse.json(
        { success: false, error: "Minimum salary cannot be greater than maximum salary" },
        { status: 400 }
      );
    }

    // Validate apply by date if provided
    if (body.applyBy) {
      const applyByDate = new Date(body.applyBy);
      const postedAtDate = body.postedAt ? new Date(body.postedAt) : new Date();
      if (applyByDate < postedAtDate) {
        return NextResponse.json(
          { success: false, error: "Application deadline cannot be before posting date" },
          { status: 400 }
        );
      }
    }

    // If slug is being updated, check if it already exists
    if (body.slug) {
      const existingCareer = await Career.findOne({ 
        slug: body.slug, 
        _id: { $ne: id } 
      });
      if (existingCareer) {
        return NextResponse.json(
          { success: false, error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    const career = await Career.findByIdAndUpdate(
      id,
      { 
        ...body, 
        updatedBy: decoded.userId,
        updatedAt: new Date() 
      },
      { new: true, runValidators: true }
    ).populate("createdBy", "name email")
     .populate("updatedBy", "name email");

    if (!career) {
      return NextResponse.json(
        { success: false, error: "Career not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: career,
      message: "Career updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating career:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Slug already exists" },
        { status: 400 }
      );
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update career" },
      { status: 500 }
    );
  }
}

// DELETE /api/careers/[id] - Delete career (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    ensureModelsRegistered();

    // Check authentication and admin role
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

    if (decoded.role !== "Admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid career ID" },
        { status: 400 }
      );
    }

    const career = await Career.findByIdAndDelete(id);

    if (!career) {
      return NextResponse.json(
        { success: false, error: "Career not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Career deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting career:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete career" },
      { status: 500 }
    );
  }
}
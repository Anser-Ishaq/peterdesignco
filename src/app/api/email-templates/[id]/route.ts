import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import EmailTemplate from "@/app/models/EmailTemplate";
import User from "@/app/models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// GET /api/email-templates/[id] - Get a single email template
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    // Ensure models are registered
    User;
    EmailTemplate;

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid template ID" },
        { status: 400 }
      );
    }

    const template = await EmailTemplate.findById(id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error("Error fetching email template:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch email template" },
      { status: 500 }
    );
  }
}

// PUT /api/email-templates/[id] - Update an email template (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    // Ensure models are registered
    User;
    EmailTemplate;

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
        { success: false, error: "Invalid template ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const template = await EmailTemplate.findByIdAndUpdate(
      id,
      { 
        ...body, 
        updatedBy: decoded.userId,
        updatedAt: new Date() 
      },
      { new: true, runValidators: true }
    ).populate("createdBy", "name email")
     .populate("updatedBy", "name email");

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: template,
      message: "Email template updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating email template:", error);
    
    return NextResponse.json(
      { success: false, error: "Failed to update email template" },
      { status: 500 }
    );
  }
}

// DELETE /api/email-templates/[id] - Delete an email template (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    // Ensure models are registered
    User;
    EmailTemplate;

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
        { success: false, error: "Invalid template ID" },
        { status: 400 }
      );
    }

    const template = await EmailTemplate.findByIdAndDelete(id);

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email template deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting email template:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete email template" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { ensureModelsRegistered, JobApplication, Career, User } from "@/app/lib/models";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// GET /api/job-applications/[id] - Get single job application (Admin only)
export async function GET(
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
        { success: false, error: "Invalid application ID" },
        { status: 400 }
      );
    }

    const application = await JobApplication.findById(id)
      .populate("careerId", "title department location employmentType salaryRange")
      .populate("reviewedBy", "name email");

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Error fetching job application:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch job application" },
      { status: 500 }
    );
  }
}

// PUT /api/job-applications/[id] - Update job application status (Admin only)
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
        { success: false, error: "Invalid application ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { applicationStatus, notes } = body;

    // Validate status
    const validStatuses = ["pending", "reviewed", "shortlisted", "interviewed", "rejected", "hired"];
    if (applicationStatus && !validStatuses.includes(applicationStatus)) {
      return NextResponse.json(
        { success: false, error: "Invalid application status" },
        { status: 400 }
      );
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (applicationStatus) {
      updateData.applicationStatus = applicationStatus;
      updateData.reviewedBy = decoded.userId;
      updateData.reviewedAt = new Date();
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const application = await JobApplication.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("careerId", "title department location employmentType salaryRange")
     .populate("reviewedBy", "name email");

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: application,
      message: "Application updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating job application:", error);
    
    return NextResponse.json(
      { success: false, error: "Failed to update job application" },
      { status: 500 }
    );
  }
}

// DELETE /api/job-applications/[id] - Delete job application (Admin only)
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
        { success: false, error: "Invalid application ID" },
        { status: 400 }
      );
    }

    const application = await JobApplication.findByIdAndDelete(id);

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job application:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete job application" },
      { status: 500 }
    );
  }
}
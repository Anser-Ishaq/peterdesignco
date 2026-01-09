import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Query from "@/app/models/Query";
import jwt from "jsonwebtoken";

// GET /api/queries/[id] - Get a single query (Admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const resolvedParams = await params;

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

    const query = await Query.findById(resolvedParams.id)
      .populate("repliedBy", "name email");

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Query not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: query,
    });
  } catch (error) {
    console.error("Error fetching query:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch query" },
      { status: 500 }
    );
  }
}

// PUT /api/queries/[id] - Update query status/notes (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const resolvedParams = await params;

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

    const body = await request.json();
    const { status, adminNotes } = body;

    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
      if (status === 'replied') {
        updateData.repliedAt = new Date();
        updateData.repliedBy = decoded.userId;
      }
    }
    
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    // Update query
    const query = await Query.findByIdAndUpdate(
      resolvedParams.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("repliedBy", "name email");

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Query not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: query,
      message: "Query updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating query:", error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update query" },
      { status: 500 }
    );
  }
}

// DELETE /api/queries/[id] - Delete a query (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const resolvedParams = await params;

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

    // Delete query
    const query = await Query.findByIdAndDelete(resolvedParams.id);

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Query not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Query deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting query:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete query" },
      { status: 500 }
    );
  }
}
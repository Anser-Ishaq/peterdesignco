import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Model from "@/app/models/Model";
import { deleteFromCloudinary } from "@/app/lib/cloudinary";
import jwt from "jsonwebtoken";

// GET /api/models/[id] - Get a single model
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const resolvedParams = await params;

    const model = await Model.findById(resolvedParams.id);

    if (!model) {
      return NextResponse.json(
        { success: false, error: "Model not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: model,
    });
  } catch (error) {
    console.error("Error fetching model:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch model" },
      { status: 500 }
    );
  }
}

// PUT /api/models/[id] - Update a model (Admin only)
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

    // Validate file size if modelFile is being updated
    if (body.modelFile && body.modelFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Model file size cannot exceed 5MB" },
        { status: 400 }
      );
    }

    // Check if slug already exists (excluding current model)
    if (body.slug) {
      const existingModel = await Model.findOne({ 
        slug: body.slug, 
        _id: { $ne: resolvedParams.id } 
      });
      if (existingModel) {
        return NextResponse.json(
          { success: false, error: "Model with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const model = await Model.findByIdAndUpdate(
      resolvedParams.id,
      body,
      { new: true, runValidators: true }
    );

    if (!model) {
      return NextResponse.json(
        { success: false, error: "Model not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: model,
      message: "Model updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating model:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Model with this slug already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update model" },
      { status: 500 }
    );
  }
}

// DELETE /api/models/[id] - Delete a model (Admin only)
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

    const model = await Model.findById(resolvedParams.id);

    if (!model) {
      return NextResponse.json(
        { success: false, error: "Model not found" },
        { status: 404 }
      );
    }

    // Delete files from Cloudinary
    try {
      if (model.modelFile.publicId) {
        await deleteFromCloudinary(model.modelFile.publicId);
      }
      if (model.thumbnail?.publicId) {
        await deleteFromCloudinary(model.thumbnail.publicId);
      }
    } catch (cloudinaryError) {
      console.error("Error deleting files from Cloudinary:", cloudinaryError);
      // Continue with model deletion even if Cloudinary deletion fails
    }

    await Model.findByIdAndDelete(resolvedParams.id);

    return NextResponse.json({
      success: true,
      message: "Model deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting model:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete model" },
      { status: 500 }
    );
  }
}
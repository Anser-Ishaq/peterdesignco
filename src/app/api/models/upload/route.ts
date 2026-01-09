import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/app/lib/cloudinary";
import jwt from "jsonwebtoken";

// POST /api/models/upload - Upload GLB model file
export async function POST(request: NextRequest) {
  try {
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

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // 'model' or 'thumbnail'

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (type === "model") {
      if (!file.name.toLowerCase().endsWith('.glb')) {
        return NextResponse.json(
          { success: false, error: "Only GLB files are allowed for models" },
          { status: 400 }
        );
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "Model file size cannot exceed 5MB" },
          { status: 400 }
        );
      }
    } else if (type === "thumbnail") {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: "Only JPEG, PNG, and WebP images are allowed for thumbnails" },
          { status: 400 }
        );
      }

      // Check file size (2MB limit for thumbnails)
      if (file.size > 2 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "Thumbnail file size cannot exceed 2MB" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Must be 'model' or 'thumbnail'" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadOptions = {
      folder: type === "model" ? "3d-models" : "3d-models/thumbnails",
      format: type === "model" ? "glb" : undefined,
    };

    const result = await uploadToCloudinary(buffer, uploadOptions);

    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        size: result.bytes,
        format: result.format,
      },
      message: `${type === "model" ? "Model" : "Thumbnail"} uploaded successfully`,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
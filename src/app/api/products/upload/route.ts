import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "@/app/lib/cloudinary";

// POST /api/products/upload - Upload product images (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    if (decoded.role !== "Admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("images") as File[];
    const imageType = formData.get("imageType") as string; // 'thumbnail' or 'gallery'

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No image files provided" },
        { status: 400 }
      );
    }

    // Validate file types and sizes
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid file type. Only JPEG, PNG, and WebP are allowed",
          },
          { status: 400 }
        );
      }

      if (file.size > maxSize) {
        return NextResponse.json(
          {
            success: false,
            message: "File size too large. Maximum size is 5MB per image",
          },
          { status: 400 }
        );
      }
    }

    // Upload all files to Cloudinary
    const uploadPromises = files.map(async (file, index) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Different transformations for thumbnail vs gallery images
      const transformations = imageType === "thumbnail" 
        ? [{ width: 600, height: 600, crop: "fill", gravity: "center" }]
        : [{ width: 1200, height: 1200, crop: "fill", gravity: "center" }];

      const uploadResult = await uploadToCloudinary(buffer, {
        folder: imageType === "thumbnail" ? "products/thumbnails" : "products/gallery",
        quality: "auto:good",
        transformation: transformations,
      });

      return {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        alt: `Product ${imageType} ${index + 1}`,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
      };
    });

    const uploadResults = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      message: `${uploadResults.length} image(s) uploaded successfully`,
      data: imageType === "thumbnail" ? uploadResults[0] : uploadResults,
    });

  } catch (error) {
    console.error("Product image upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload images",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/app/lib/auth';
import { uploadToCloudinary } from '@/app/lib/cloudinary';

// POST /api/team/upload - Upload team member image (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    if (user.role !== 'Admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' 
        },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'File size too large. Maximum size is 5MB' 
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer, {
      folder: 'team-members',
      quality: 'auto:good',
      transformation: [
        { 
          width: 800, 
          height: 800, 
          crop: 'fill', 
          gravity: 'face'
        }
      ],
    });

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
      },
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to upload image',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/job-applications/upload - Upload resume file (Public)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No resume file provided' },
        { status: 400 }
      );
    }

    // Validate file type (PDF, DOC, DOCX)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed' 
        },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'File size too large. Maximum size is 10MB' 
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary as raw file
    const uploadOptions = {
      folder: 'resumes',
      resource_type: 'raw' as const,
      public_id: `resume_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      overwrite: true,
      invalidate: true,
    };

    // Convert Buffer to base64 string for raw files
    const fileToUpload = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(fileToUpload, uploadOptions);

    return NextResponse.json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        originalName: file.name,
        size: file.size,
        type: file.type,
        bytes: result.bytes,
      },
    });

  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to upload resume',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
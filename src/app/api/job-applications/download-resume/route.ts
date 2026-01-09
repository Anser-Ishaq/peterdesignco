import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from "@/app/lib/mongodb";
import { ensureModelsRegistered, JobApplication } from "@/app/lib/models";
import jwt from "jsonwebtoken";

// GET /api/job-applications/download-resume - Download resume with proper filename
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("applicationId");

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: "Application ID is required" },
        { status: 400 }
      );
    }

    // Get the application
    const application = await JobApplication.findById(applicationId)
      .populate("careerId", "title");

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    if (!application.resumeUrl) {
      return NextResponse.json(
        { success: false, error: "No resume found for this application" },
        { status: 404 }
      );
    }

    // Fetch the resume from Cloudinary
    const resumeResponse = await fetch(application.resumeUrl);
    
    if (!resumeResponse.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch resume file" },
        { status: 500 }
      );
    }

    const resumeBuffer = await resumeResponse.arrayBuffer();
    
    // Determine file extension based on content type or URL
    let fileExtension = '.pdf'; // Default to PDF
    const contentType = resumeResponse.headers.get('content-type');
    
    if (contentType) {
      if (contentType.includes('application/pdf')) {
        fileExtension = '.pdf';
      } else if (contentType.includes('application/msword')) {
        fileExtension = '.doc';
      } else if (contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        fileExtension = '.docx';
      }
    }

    // Create a proper filename
    const sanitizedName = application.applicantName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    const jobTitle = application.careerId?.title?.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'Position';
    const filename = `${sanitizedName}_${jobTitle}_Resume${fileExtension}`;

    // Return the file with proper headers
    return new NextResponse(resumeBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType || 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': resumeBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Error downloading resume:', error);
    return NextResponse.json(
      { success: false, error: "Failed to download resume" },
      { status: 500 }
    );
  }
}
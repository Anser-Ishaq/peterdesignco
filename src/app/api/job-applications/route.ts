import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { ensureModelsRegistered, JobApplication, Career, User } from "@/app/lib/models";
import jwt from "jsonwebtoken";

// GET /api/job-applications - Get all job applications (Admin only)
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
    const status = searchParams.get("status");
    const careerId = searchParams.get("careerId");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");

    // Build query
    const query: any = {};
    
    if (status) {
      query.applicationStatus = status;
    }
    
    if (careerId) {
      query.careerId = careerId;
    }

    if (search) {
      query.$or = [
        { applicantName: { $regex: search, $options: "i" } },
        { applicantEmail: { $regex: search, $options: "i" } },
        { currentPosition: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    // Get applications with pagination and sorting
    const applications = await JobApplication.find(query)
      .populate("careerId", "title department location employmentType")
      .populate("reviewedBy", "name email")
      .sort({ appliedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await JobApplication.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch job applications" },
      { status: 500 }
    );
  }
}

// POST /api/job-applications - Submit a new job application (Public)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    ensureModelsRegistered();

    const body = await request.json();
    const {
      careerId,
      applicantName,
      applicantEmail,
      applicantPhone,
      currentPosition,
      yearsOfExperience,
      expectedSalary,
      resumeUrl,
      coverLetter,
    } = body;

    // Validate required fields
    if (!careerId || !applicantName || !applicantEmail) {
      return NextResponse.json(
        { success: false, error: "Career ID, name, and email are required" },
        { status: 400 }
      );
    }

    // Verify career exists and is active
    const career = await Career.findById(careerId);
    if (!career) {
      return NextResponse.json(
        { success: false, error: "Career not found" },
        { status: 404 }
      );
    }

    if (career.status !== "active") {
      return NextResponse.json(
        { success: false, error: "This career position is no longer accepting applications" },
        { status: 400 }
      );
    }

    // Check if application deadline has passed
    if (new Date() > new Date(career.applyBy)) {
      return NextResponse.json(
        { success: false, error: "Application deadline has passed" },
        { status: 400 }
      );
    }

    // Check if user has already applied for this position
    const existingApplication = await JobApplication.findOne({
      careerId,
      applicantEmail: applicantEmail.toLowerCase(),
    });

    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: "You have already applied for this position" },
        { status: 400 }
      );
    }

    // Create new job application
    const application = new JobApplication({
      careerId,
      applicantName,
      applicantEmail: applicantEmail.toLowerCase(),
      applicantPhone,
      currentPosition,
      yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : undefined,
      expectedSalary: expectedSalary ? parseInt(expectedSalary) : undefined,
      resumeUrl,
      coverLetter,
    });

    await application.save();

    // Populate the created application
    const populatedApplication = await JobApplication.findById(application._id)
      .populate("careerId", "title department location employmentType");

    return NextResponse.json({
      success: true,
      data: populatedApplication,
      message: "Application submitted successfully",
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating job application:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "You have already applied for this position" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
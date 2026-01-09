import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import EmailTemplate from "@/app/models/EmailTemplate";
import User from "@/app/models/User";
import jwt from "jsonwebtoken";

// GET /api/email-templates - Get all email templates
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Ensure models are registered
    User;
    EmailTemplate;

    // Check authentication
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status") || "active";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Build query
    const query: any = { status };
    
    if (type) {
      query.type = type;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get templates with pagination
    const templates = await EmailTemplate.find(query)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await EmailTemplate.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: templates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching email templates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch email templates" },
      { status: 500 }
    );
  }
}

// POST /api/email-templates - Create a new email template (Admin only)
export async function POST(request: NextRequest) {
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

    const body = await request.json();

    // Validate required fields
    const requiredFields = ["name", "subject", "message", "type"];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Create new email template
    const template = new EmailTemplate({
      ...body,
      createdBy: decoded.userId,
      updatedBy: decoded.userId,
    });

    await template.save();

    // Populate the created template
    const populatedTemplate = await EmailTemplate.findById(template._id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    return NextResponse.json({
      success: true,
      data: populatedTemplate,
      message: "Email template created successfully",
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating email template:", error);
    
    return NextResponse.json(
      { success: false, error: "Failed to create email template" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Testimonial from "@/app/models/Testimonial";
import jwt from "jsonwebtoken";

// GET /api/testimonials - Get all testimonials
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search");

    // Build query
    const query: any = {};
    
    if (isActive !== null) {
      query.isActive = isActive === "true";
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { position: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { review: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    // Get testimonials with pagination and sorting
    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Testimonial.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: testimonials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST /api/testimonials - Create a new testimonial (Admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

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
    const { name, position, company, review, rating, imageUrl, imagePublicId, isActive } = body;

    // Validate required fields
    if (!name || !position || !review || !rating) {
      return NextResponse.json(
        { success: false, error: "Name, position, review, and rating are required" },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Create new testimonial
    const testimonial = new Testimonial({
      name,
      position,
      company,
      review,
      rating,
      imageUrl,
      imagePublicId,
      isActive: isActive !== undefined ? isActive : true,
    });

    await testimonial.save();

    return NextResponse.json({
      success: true,
      data: testimonial,
      message: "Testimonial created successfully",
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating testimonial:", error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Model from "@/app/models/Model";
import jwt from "jsonwebtoken";

// GET /api/models - Get all models with optional filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status") || "active";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");
    const isWallMounted = searchParams.get("isWallMounted");

    // Build query
    const query: any = { status };
    
    if (category) {
      query.category = category;
    }

    if (isWallMounted !== null) {
      query.isWallMounted = isWallMounted === "true";
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get models with pagination
    const models = await Model.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Model.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: models,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}

// POST /api/models - Create a new model (Admin only)
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

    // Validate required fields
    const requiredFields = [
      "name",
      "slug",
      "category",
      "modelFile",
      "dimensions",
      "description",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate file size (5MB limit)
    if (body.modelFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Model file size cannot exceed 5MB" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingModel = await Model.findOne({ slug: body.slug });
    if (existingModel) {
      return NextResponse.json(
        { success: false, error: "Model with this slug already exists" },
        { status: 400 }
      );
    }

    // Create new model
    const model = new Model(body);
    await model.save();

    return NextResponse.json({
      success: true,
      data: model,
      message: "Model created successfully",
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating model:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Model with this slug already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create model" },
      { status: 500 }
    );
  }
}
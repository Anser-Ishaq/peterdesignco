import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { ensureModelsRegistered, Career, User } from "@/app/lib/models";

// GET /api/careers/slug/[slug] - Get career by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    ensureModelsRegistered();

    const { slug } = await params;

    const career = await Career.findOne({ slug, status: "active" })
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!career) {
      return NextResponse.json(
        { success: false, error: "Career not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: career,
    });
  } catch (error) {
    console.error("Error fetching career by slug:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch career" },
      { status: 500 }
    );
  }
}
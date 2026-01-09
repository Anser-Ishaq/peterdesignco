import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Query from "@/app/models/Query";

// POST /api/contact - Submit a contact form (Public)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Create new query
    const query = new Query({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      message: message.trim(),
      status: 'new'
    });

    await query.save();

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
      data: {
        id: query._id,
        name: query.name,
        email: query.email,
        createdAt: query.createdAt
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating contact query:", error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to submit your message. Please try again." },
      { status: 500 }
    );
  }
}
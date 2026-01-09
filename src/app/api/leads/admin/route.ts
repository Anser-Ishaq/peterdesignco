import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { ensureModelsRegistered, Lead, User, Product } from "@/app/lib/models";
import jwt from "jsonwebtoken";

// GET /api/leads/admin - Get all leads for admin (with user and product info)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Ensure all models are registered
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
    const status = searchParams.get("status") || "active";
    const search = searchParams.get("search");

    // Build query
    const query: any = { status };

    // Get leads with populated user and product data
    let leadsQuery = Lead.find(query)
      .populate("userId", "name email role")
      .populate("productId", "name slug thumbnail pricing stock quality category sku")
      .sort({ createdAt: -1 });

    const leads = await leadsQuery;

    // Filter by search if provided (search in user name/email)
    let filteredLeads = leads;
    if (search) {
      filteredLeads = leads.filter(lead => 
        lead.userId.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.userId.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredLeads,
    });
  } catch (error) {
    console.error("Error fetching admin leads:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Query from "@/app/models/Query";
import EmailTemplate from "@/app/models/EmailTemplate";
import { sendEmail } from "@/app/lib/email";
import jwt from "jsonwebtoken";

// POST /api/queries/send-email - Send email to query submitter using template (Admin only)
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
    const { queryId, templateId, customSubject, customMessage } = body;

    if (!queryId) {
      return NextResponse.json(
        { success: false, error: "Query ID is required" },
        { status: 400 }
      );
    }

    // Get the query
    const query = await Query.findById(queryId);
    if (!query) {
      return NextResponse.json(
        { success: false, error: "Query not found" },
        { status: 404 }
      );
    }

    let subject = "";
    let message = "";

    if (templateId) {
      // Use email template
      const template = await EmailTemplate.findById(templateId);
      if (!template) {
        return NextResponse.json(
          { success: false, error: "Email template not found" },
          { status: 404 }
        );
      }

      if (template.status !== 'active') {
        return NextResponse.json(
          { success: false, error: "Email template is not active" },
          { status: 400 }
        );
      }

      subject = template.subject;
      message = template.message;
    } else if (customSubject && customMessage) {
      // Use custom subject and message
      subject = customSubject;
      message = customMessage;
    } else {
      return NextResponse.json(
        { success: false, error: "Either template ID or custom subject and message are required" },
        { status: 400 }
      );
    }

    // Replace variables in subject and message
    const variables = {
      name: query.name,
      email: query.email,
      phone: query.phone || 'Not provided',
      message: query.message,
      company: process.env.EMAIL_FROM_NAME || 'Your Company',
      date: new Date().toLocaleDateString(),
    };

    // Replace placeholders
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(placeholder, value);
      message = message.replace(placeholder, value);
    });

    // Check if email configuration is available
    const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;
    
    if (!isEmailConfigured) {
      // Simulate email sending for development
      console.log('=== EMAIL SIMULATION ===');
      console.log('From:', process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER);
      console.log('To:', query.email);
      console.log('Subject:', subject);
      console.log('Message:', message);
      console.log('========================');

      // Update query status
      await Query.findByIdAndUpdate(queryId, {
        status: 'replied',
        repliedAt: new Date(),
        repliedBy: decoded.userId,
      });

      return NextResponse.json({
        success: true,
        message: "Email simulated successfully (configure EMAIL_USER and EMAIL_PASS to send real emails)",
        data: {
          isSimulated: true,
          fromEmail: process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER,
          toEmail: query.email,
          subject: subject,
        },
      });
    }

    // Send actual email
    const emailSent = await sendEmail({
      to: query.email,
      subject: subject,
      html: message.replace(/\n/g, '<br>'),
    });

    if (!emailSent) {
      return NextResponse.json(
        { success: false, error: "Failed to send email" },
        { status: 500 }
      );
    }

    // Update query status
    await Query.findByIdAndUpdate(queryId, {
      status: 'replied',
      repliedAt: new Date(),
      repliedBy: decoded.userId,
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      data: {
        isSimulated: false,
        fromEmail: process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER,
        toEmail: query.email,
        subject: subject,
      },
    });

  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
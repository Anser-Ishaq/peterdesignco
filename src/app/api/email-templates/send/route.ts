import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import EmailTemplate from "@/app/models/EmailTemplate";
import { sendEmail, textToHtml } from "@/app/lib/email";
import jwt from "jsonwebtoken";

// POST /api/email-templates/send - Send email using template
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
    const { templateId, recipientEmail, recipientName, variables = {} } = body;

    // Validate required fields
    if (!templateId || !recipientEmail) {
      return NextResponse.json(
        { success: false, error: "Template ID and recipient email are required" },
        { status: 400 }
      );
    }

    // Get the email template
    const template = await EmailTemplate.findById(templateId);
    if (!template) {
      return NextResponse.json(
        { success: false, error: "Email template not found" },
        { status: 404 }
      );
    }

    if (template.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Email template is not active" },
        { status: 400 }
      );
    }

    // Replace template variables
    const defaultVariables = {
      name: recipientName || "Customer",
      email: recipientEmail,
      date: new Date().toLocaleDateString(),
      ...variables
    };

    let subject = template.subject;
    let message = template.message;

    // Replace variables in subject and message
    Object.keys(defaultVariables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(regex, defaultVariables[key]);
      message = message.replace(regex, defaultVariables[key]);
    });

    // Check if email service is configured
    const emailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

    if (emailConfigured) {
      // Send real email
      const emailSent = await sendEmail({
        to: recipientEmail,
        subject: subject,
        html: textToHtml(message),
        text: message,
      });

      if (!emailSent) {
        return NextResponse.json(
          { success: false, error: "Failed to send email" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Email sent successfully",
        data: {
          to: recipientEmail,
          subject: subject,
          template: template.name,
          sentAt: new Date().toISOString(),
          fromEmail: process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER,
        }
      });
    } else {
      // Fallback to simulation for MVP/development
      console.log("📧 EMAIL SIMULATION (Configure EMAIL_USER and EMAIL_PASS for real emails):");
      console.log("From:", process.env.EMAIL_FROM_ADDRESS || "your-email@company.com");
      console.log("To:", recipientEmail);
      console.log("Subject:", subject);
      console.log("Message:", message);
      console.log("Template:", template.name);
      console.log("Sent by Admin ID:", decoded.userId);
      console.log("Sent at:", new Date().toISOString());
      console.log("---");

      return NextResponse.json({
        success: true,
        message: "Email simulated successfully (Configure EMAIL_USER and EMAIL_PASS for real emails)",
        data: {
          to: recipientEmail,
          subject: subject,
          template: template.name,
          sentAt: new Date().toISOString(),
          fromEmail: "your-email@company.com (simulated)",
          isSimulated: true,
        }
      });
    }

  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
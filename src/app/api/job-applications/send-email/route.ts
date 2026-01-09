import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { ensureModelsRegistered, JobApplication, EmailTemplate, Career, User } from "@/app/lib/models";
import { sendEmail } from "@/app/lib/email";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// POST /api/job-applications/send-email - Send email to applicant using template (Admin only)
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { applicationId, templateId, customSubject, customMessage } = body;

    // Validate required fields
    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: "Application ID is required" },
        { status: 400 }
      );
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return NextResponse.json(
        { success: false, error: "Invalid application ID" },
        { status: 400 }
      );
    }

    if (templateId && !mongoose.Types.ObjectId.isValid(templateId)) {
      return NextResponse.json(
        { success: false, error: "Invalid template ID" },
        { status: 400 }
      );
    }

    // Get job application with populated data
    const application = await JobApplication.findById(applicationId)
      .populate("careerId", "title department location employmentType salaryRange");

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    let emailSubject = "";
    let emailMessage = "";

    if (templateId) {
      // Use email template
      const template = await EmailTemplate.findById(templateId);
      if (!template) {
        return NextResponse.json(
          { success: false, error: "Email template not found" },
          { status: 404 }
        );
      }

      emailSubject = template.subject;
      emailMessage = template.message;
    } else if (customSubject && customMessage) {
      // Use custom email
      emailSubject = customSubject;
      emailMessage = customMessage;
    } else {
      return NextResponse.json(
        { success: false, error: "Either template ID or custom subject and message are required" },
        { status: 400 }
      );
    }

    // Replace template variables
    const career = application.careerId as any;
    const replacements = {
      '{{name}}': application.applicantName,
      '{{email}}': application.applicantEmail,
      '{{phone}}': application.applicantPhone || 'N/A',
      '{{position}}': career.title,
      '{{department}}': career.department,
      '{{location}}': career.location,
      '{{company}}': process.env.COMPANY_NAME || 'Peter Design Co',
      '{{date}}': new Date().toLocaleDateString(),
      '{{currentPosition}}': application.currentPosition || 'N/A',
      '{{experience}}': application.yearsOfExperience ? `${application.yearsOfExperience} years` : 'N/A',
      '{{expectedSalary}}': application.expectedSalary ? `${application.expectedSalary.toLocaleString()} PKR` : 'N/A',
    };

    // Apply replacements
    let finalSubject = emailSubject;
    let finalMessage = emailMessage;

    Object.entries(replacements).forEach(([placeholder, value]) => {
      finalSubject = finalSubject.replace(new RegExp(placeholder, 'g'), value);
      finalMessage = finalMessage.replace(new RegExp(placeholder, 'g'), value);
    });

    // Send email
    const emailSent = await sendEmail({
      to: application.applicantEmail,
      subject: finalSubject,
      html: finalMessage.replace(/\n/g, '<br>'),
      text: finalMessage,
    });

    if (!emailSent) {
      return NextResponse.json(
        { success: false, error: "Failed to send email" },
        { status: 500 }
      );
    }

    // Update application with email sent info (optional)
    await JobApplication.findByIdAndUpdate(applicationId, {
      notes: application.notes 
        ? `${application.notes}\n\n[${new Date().toLocaleString()}] Email sent: ${finalSubject}`
        : `[${new Date().toLocaleString()}] Email sent: ${finalSubject}`,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      data: {
        to: application.applicantEmail,
        subject: finalSubject,
        sentAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error sending email to applicant:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
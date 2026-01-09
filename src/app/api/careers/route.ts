import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Career from '@/app/models/Career';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const careers = await Career.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: careers
    });

  } catch (error) {
    console.error('Error fetching careers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch careers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { 
      title, 
      slug,
      department,
      description, 
      location, 
      workMode,
      employmentType,
      experienceLevel,
      salaryRange,
      requirements, 
      responsibilities,
      applyBy,
      createdBy,
      updatedBy
    } = body;

    if (!title || !slug || !department || !description || !location || !workMode || !employmentType || !experienceLevel || !applyBy || !createdBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const career = new Career({
      title,
      slug,
      department,
      location,
      workMode,
      employmentType,
      experienceLevel,
      salaryRange: salaryRange || { min: 0, max: 0, currency: 'PKR' },
      description,
      requirements: requirements || [],
      responsibilities: responsibilities || [],
      applyBy: new Date(applyBy),
      createdBy,
      updatedBy: updatedBy || createdBy
    });

    await career.save();

    return NextResponse.json({
      success: true,
      data: career
    });

  } catch (error) {
    console.error('Error creating career:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create career' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Lead from '@/app/models/Lead';
import { getUserFromRequest } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    
    if (!user || user.role !== 'Admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const leads = await Lead.find({})
      .populate('userId', 'name email')
      .populate('productId', 'name pricing')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: leads
    });

  } catch (error) {
    console.error('Error fetching all leads:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
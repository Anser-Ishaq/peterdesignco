import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { getUserFromRequest } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    
    // Only allow admin users to run migrations
    if (!user || user.role !== 'Admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await connectDB();

    // Update all users to ensure they have phone and bio fields
    const result = await User.updateMany(
      {
        $or: [
          { phone: { $exists: false } },
          { bio: { $exists: false } }
        ]
      },
      {
        $set: {
          phone: '',
          bio: ''
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'User migration completed successfully',
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      }
    });

  } catch (error) {
    console.error('Error migrating users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to migrate users' },
      { status: 500 }
    );
  }
}
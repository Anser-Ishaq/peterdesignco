import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import { getUserFromRequest } from '@/app/lib/auth';
import User from '@/app/models/User';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get user from token
    const tokenPayload = getUserFromRequest(request);
    
    if (!tokenPayload) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized - No valid token provided'
        },
        { status: 401 }
      );
    }

    // Find user in database
    const user = await User.findById(tokenPayload.userId);
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Get user error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
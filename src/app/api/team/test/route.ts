import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Team from '@/app/models/Team';
import User from '@/app/models/User';

// GET /api/team/test - Test endpoint to verify setup
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Test database connection
    const userCount = await User.countDocuments();
    const teamCount = await Team.countDocuments();

    // Test Cloudinary config
    const cloudinaryConfig = {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
      apiKey: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
      apiSecret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing',
    };

    // Test JWT config
    const jwtSecret = process.env.JWT_SECRET ? 'Set' : 'Missing';

    return NextResponse.json({
      success: true,
      message: 'Team API setup test',
      data: {
        database: {
          connected: true,
          userCount,
          teamCount,
        },
        cloudinary: cloudinaryConfig,
        jwt: jwtSecret,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
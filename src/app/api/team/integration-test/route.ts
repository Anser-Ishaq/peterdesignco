import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Team from '@/app/models/Team';
import User from '@/app/models/User';
import { uploadToCloudinary, deleteFromCloudinary } from '@/app/lib/cloudinary';

// GET /api/team/integration-test - Run integration tests
export async function GET(request: NextRequest) {
  try {
    const results = {
      database: false,
      cloudinary: false,
      teamModel: false,
      userModel: false,
      errors: [] as string[],
    };

    // Test 1: Database Connection
    try {
      await connectDB();
      results.database = true;
    } catch (error) {
      results.errors.push(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 2: User Model
    try {
      const userCount = await User.countDocuments();
      results.userModel = true;
    } catch (error) {
      results.errors.push(`User model test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 3: Team Model
    try {
      const teamCount = await Team.countDocuments();
      results.teamModel = true;
    } catch (error) {
      results.errors.push(`Team model test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 4: Cloudinary Configuration
    try {
      const cloudinaryConfig = {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
      };

      if (!cloudinaryConfig.cloudName || !cloudinaryConfig.apiKey || !cloudinaryConfig.apiSecret) {
        results.errors.push('Cloudinary environment variables are missing');
      } else {
        results.cloudinary = true;
      }
    } catch (error) {
      results.errors.push(`Cloudinary test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const allTestsPassed = results.database && results.cloudinary && results.teamModel && results.userModel;

    return NextResponse.json({
      success: allTestsPassed,
      message: allTestsPassed ? 'All integration tests passed' : 'Some tests failed',
      data: {
        results,
        summary: {
          total: 4,
          passed: Object.values(results).filter(v => v === true).length,
          failed: results.errors.length,
        },
        recommendations: allTestsPassed ? [
          'Your Team API is ready to use!',
          'You can now test the endpoints using Postman',
          'Make sure to create an admin user for testing'
        ] : [
          'Fix the failing tests before using the API',
          'Check your environment variables',
          'Ensure MongoDB is running and accessible'
        ]
      },
    });

  } catch (error) {
    console.error('Integration test error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Integration test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
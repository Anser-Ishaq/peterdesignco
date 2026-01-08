import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// GET /api/team/cloudinary-test - Test Cloudinary configuration
export async function GET(request: NextRequest) {
  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Test configuration
    const config = cloudinary.config();
    
    const testResult = {
      cloudName: config.cloud_name ? 'Set' : 'Missing',
      apiKey: config.api_key ? 'Set' : 'Missing',
      apiSecret: config.api_secret ? 'Set' : 'Missing',
      configValid: !!(config.cloud_name && config.api_key && config.api_secret),
    };

    // Try a simple API call to test credentials
    let apiTest = false;
    try {
      await cloudinary.api.ping();
      apiTest = true;
    } catch (error) {
      console.error('Cloudinary API test failed:', error);
    }

    return NextResponse.json({
      success: testResult.configValid && apiTest,
      message: testResult.configValid && apiTest 
        ? 'Cloudinary configuration is working' 
        : 'Cloudinary configuration has issues',
      data: {
        configuration: testResult,
        apiConnection: apiTest,
        recommendations: testResult.configValid && apiTest ? [
          'Cloudinary is properly configured',
          'You can now upload images',
          'Try uploading a test image'
        ] : [
          'Check your environment variables',
          'Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set',
          'Verify your Cloudinary credentials are correct'
        ]
      },
    });

  } catch (error) {
    console.error('Cloudinary test error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Cloudinary test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
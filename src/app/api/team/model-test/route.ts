import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Team from '@/app/models/Team';
import User from '@/app/models/User';
import mongoose from 'mongoose';

// GET /api/team/model-test - Test model registration and population
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const results = {
      userModelRegistered: false,
      teamModelRegistered: false,
      populationTest: false,
      errors: [] as string[],
    };

    // Test 1: Check if User model is registered
    try {
      const userModel = mongoose.model('User');
      results.userModelRegistered = true;
    } catch (error) {
      results.errors.push(`User model registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 2: Check if Team model is registered
    try {
      const teamModel = mongoose.model('Team');
      results.teamModelRegistered = true;
    } catch (error) {
      results.errors.push(`Team model registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 3: Test population (if both models are registered)
    if (results.userModelRegistered && results.teamModelRegistered) {
      try {
        // Try to find team members with population (should not throw error even if no data)
        const teamMembers = await Team.find({})
          .populate('createdBy', 'name email')
          .populate('updatedBy', 'name email')
          .limit(1);
        
        results.populationTest = true;
      } catch (error) {
        results.errors.push(`Population test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    const allTestsPassed = results.userModelRegistered && results.teamModelRegistered && results.populationTest;

    return NextResponse.json({
      success: allTestsPassed,
      message: allTestsPassed ? 'All model tests passed' : 'Some model tests failed',
      data: {
        results,
        registeredModels: Object.keys(mongoose.models),
        summary: {
          total: 3,
          passed: Object.values(results).filter(v => v === true).length,
          failed: results.errors.length,
        },
        recommendations: allTestsPassed ? [
          'Models are properly registered',
          'Population should work correctly',
          'Team API should work without schema errors'
        ] : [
          'Check model imports in API routes',
          'Ensure User model is imported before Team operations',
          'Verify database connection'
        ]
      },
    });

  } catch (error) {
    console.error('Model test error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Model test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
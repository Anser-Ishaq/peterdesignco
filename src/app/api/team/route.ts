import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Team from '@/app/models/Team';
import User from '@/app/models/User'; // Import User model for population
import { getUserFromRequest } from '@/app/lib/auth';

// GET /api/team - Get team members
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Ensure models are registered
    User;
    Team;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const role = searchParams.get('role');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    const query: any = {};
    
    if (status !== 'all') {
      query.status = status;
    }
    
    if (role && role !== 'all') {
      query.role = role;
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Get team members with pagination and sorting
    const teamMembers = await Team.find(query)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Team.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: teamMembers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Get team members error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch team members',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/team - Add new team member (Admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Ensure models are registered
    User;
    Team;
    
    // Check authentication and admin role
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    if (user.role !== 'Admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    const {
      name,
      slug,
      role,
      position,
      image,
      bio,
      socialLinks,
      order,
      status,
    } = body;

    // Validate required fields
    if (!name || !slug || !role || !position || !image?.url || !image?.publicId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingTeamMember = await Team.findOne({ slug });
    if (existingTeamMember) {
      return NextResponse.json(
        { success: false, message: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Create new team member
    const teamMember = new Team({
      name,
      slug,
      role,
      position,
      image: {
        url: image.url,
        publicId: image.publicId,
        alt: image.alt || `${name} - ${position}`,
      },
      bio: Array.isArray(bio) ? bio : [],
      socialLinks: socialLinks || {},
      order: order || 0,
      status: status || 'active',
      createdBy: user.userId,
      updatedBy: user.userId,
    });

    await teamMember.save();

    // Populate the created team member
    const populatedTeamMember = await Team.findById(teamMember._id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    return NextResponse.json({
      success: true,
      message: 'Team member created successfully',
      data: populatedTeamMember,
    }, { status: 201 });

  } catch (error) {
    console.error('Create team member error:', error);
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          error: error.message,
        },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: 'Team member with this slug already exists',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create team member',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Team from '@/app/models/Team';
import User from '@/app/models/User'; // Import User model for population
import { getUserFromRequest } from '@/app/lib/auth';
import { deleteFromCloudinary } from '@/app/lib/cloudinary';
import mongoose from 'mongoose';

// GET /api/team/[id] - Get single team member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid team member ID' },
        { status: 400 }
      );
    }

    const teamMember = await Team.findById(id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!teamMember) {
      return NextResponse.json(
        { success: false, message: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: teamMember,
    });

  } catch (error) {
    console.error('Get team member error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch team member',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/team/[id] - Update team member (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid team member ID' },
        { status: 400 }
      );
    }

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

    // Find existing team member
    const existingTeamMember = await Team.findById(id);
    if (!existingTeamMember) {
      return NextResponse.json(
        { success: false, message: 'Team member not found' },
        { status: 404 }
      );
    }

    // Check if slug is being changed and if it already exists
    if (slug && slug !== existingTeamMember.slug) {
      const slugExists = await Team.findOne({ slug, _id: { $ne: id } });
      if (slugExists) {
        return NextResponse.json(
          { success: false, message: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      updatedBy: user.userId,
    };

    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (role) updateData.role = role;
    if (position) updateData.position = position;
    if (image) {
      updateData.image = {
        url: image.url,
        publicId: image.publicId,
        alt: image.alt || `${name || existingTeamMember.name} - ${position || existingTeamMember.position}`,
      };
    }
    if (bio !== undefined) updateData.bio = Array.isArray(bio) ? bio : [];
    if (socialLinks !== undefined) updateData.socialLinks = socialLinks;
    if (order !== undefined) updateData.order = order;
    if (status) updateData.status = status;

    // Update team member
    const updatedTeamMember = await Team.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    return NextResponse.json({
      success: true,
      message: 'Team member updated successfully',
      data: updatedTeamMember,
    });

  } catch (error) {
    console.error('Update team member error:', error);
    
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
        message: 'Failed to update team member',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/team/[id] - Delete team member (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid team member ID' },
        { status: 400 }
      );
    }

    // Find and delete team member
    const teamMember = await Team.findById(id);
    if (!teamMember) {
      return NextResponse.json(
        { success: false, message: 'Team member not found' },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary
    try {
      if (teamMember.image.publicId) {
        await deleteFromCloudinary(teamMember.image.publicId);
      }
    } catch (cloudinaryError) {
      console.error('Failed to delete image from Cloudinary:', cloudinaryError);
      // Continue with deletion even if Cloudinary fails
    }

    // Delete team member from database
    await Team.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Team member deleted successfully',
    });

  } catch (error) {
    console.error('Delete team member error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete team member',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
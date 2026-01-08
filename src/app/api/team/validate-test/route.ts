import { NextRequest, NextResponse } from 'next/server';

// POST /api/team/validate-test - Test validation logic
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate the validation logic from the form
    const validationErrors: string[] = [];
    
    if (!body.name?.trim()) {
      validationErrors.push('Full name is required');
    }
    
    if (!body.slug?.trim()) {
      validationErrors.push('Slug is required');
    } else if (!/^[a-z0-9-]+$/.test(body.slug)) {
      validationErrors.push('Slug can only contain lowercase letters, numbers, and hyphens');
    }
    
    if (!body.role) {
      validationErrors.push('Role is required');
    }
    
    if (!body.position?.trim()) {
      validationErrors.push('Position/Title is required');
    }
    
    if (!body.hasImage) {
      validationErrors.push('Profile image is required');
    }
    
    if (body.order < 0) {
      validationErrors.push('Display order cannot be negative');
    }
    
    if (!body.bioPoints || body.bioPoints.length === 0) {
      validationErrors.push('At least one bio point is required');
    }

    return NextResponse.json({
      success: validationErrors.length === 0,
      message: validationErrors.length === 0 ? 'Validation passed' : 'Validation failed',
      errors: validationErrors,
      data: {
        receivedData: body,
        validationCount: validationErrors.length,
      }
    });

  } catch (error) {
    console.error('Validation test error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Validation test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
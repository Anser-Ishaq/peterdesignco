import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/User';
import Product from '@/app/models/Product';
import Lead from '@/app/models/Lead';

interface ActivityItem {
  id: string;
  type: 'user_registered' | 'product_updated' | 'lead_generated';
  message: string;
  timestamp: Date;
  timeAgo: string;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get the most recent activity of each type
    const [latestUser, latestProduct, latestLead] = await Promise.all([
      User.findOne({}).sort({ createdAt: -1 }).select('createdAt'),
      Product.findOne({}).sort({ updatedAt: -1 }).select('updatedAt createdAt'),
      Lead.findOne({}).sort({ createdAt: -1 }).select('createdAt')
    ]);

    const activities: ActivityItem[] = [];

    // Add latest user registration
    if (latestUser) {
      const timeAgo = getTimeAgo(latestUser.createdAt);
      activities.push({
        id: 'latest_user',
        type: 'user_registered',
        message: 'New user registered',
        timestamp: latestUser.createdAt,
        timeAgo
      });
    }

    // Add latest product activity (check if it's an update or new product)
    if (latestProduct) {
      const isNewProduct = Math.abs(new Date(latestProduct.createdAt).getTime() - new Date(latestProduct.updatedAt).getTime()) < 5000; // 5 seconds tolerance
      const timeAgo = getTimeAgo(latestProduct.updatedAt);
      activities.push({
        id: 'latest_product',
        type: 'product_updated',
        message: isNewProduct ? 'New product added' : 'Product updated',
        timestamp: latestProduct.updatedAt,
        timeAgo
      });
    }

    // Add latest lead generation
    if (latestLead) {
      const timeAgo = getTimeAgo(latestLead.createdAt);
      activities.push({
        id: 'latest_lead',
        type: 'lead_generated',
        message: 'New lead generated',
        timestamp: latestLead.createdAt,
        timeAgo
      });
    }

    // Sort by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      success: true,
      data: activities
    });

  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recent activity' },
      { status: 500 }
    );
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    return `${diffInDays} days ago`;
  }
}
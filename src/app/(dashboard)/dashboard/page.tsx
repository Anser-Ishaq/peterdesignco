'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartSummary {
  totalItems: number;
  totalValue: number;
}

interface AdminStats {
  teamMembers: number;
  totalProducts: number;
  leads: number;
  careers: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registered' | 'product_updated' | 'lead_generated';
  message: string;
  timestamp: string;
  timeAgo: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [cartSummary, setCartSummary] = useState<CartSummary>({ totalItems: 0, totalValue: 0 });
  const [adminStats, setAdminStats] = useState<AdminStats>({ 
    teamMembers: 0, 
    totalProducts: 0, 
    leads: 0, 
    careers: 0 
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data based on user role
  useEffect(() => {
    if (user?.role === 'User') {
      fetchCartSummary();
    } else if (user?.role === 'Admin') {
      fetchAdminStats();
      fetchRecentActivity();
    }
  }, [user]);

  const fetchCartSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leads', {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success) {
        const totalItems = data.data.length;
        const totalValue = data.data.reduce((sum: number, lead: any) => {
          const price = lead.productId.pricing.sale || lead.productId.pricing.original;
          return sum + (price * lead.quantity);
        }, 0);
        
        setCartSummary({ totalItems, totalValue });
      }
    } catch (error) {
      console.error('Error fetching cart summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all stats in parallel
      const [teamResponse, productsResponse, leadsResponse, careersResponse] = await Promise.all([
        fetch('/api/team', { credentials: 'include' }),
        fetch('/api/products', { credentials: 'include' }),
        fetch('/api/leads/all', { credentials: 'include' }),
        fetch('/api/careers', { credentials: 'include' })
      ]);

      const [teamData, productsData, leadsData, careersData] = await Promise.all([
        teamResponse.json(),
        productsResponse.json(),
        leadsResponse.json(),
        careersResponse.json()
      ]);

      setAdminStats({
        teamMembers: teamData.success ? teamData.data.length : 0,
        totalProducts: productsData.success ? productsData.data.length : 0,
        leads: leadsData.success ? leadsData.data.length : 0,
        careers: careersData.success ? careersData.data.length : 0
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch('/api/dashboard/activity', {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success) {
        setRecentActivity(data.data);
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const adminDashboardDetails = [
    {
      id: 1,
      title: "Team Members",
      number: loading ? "..." : adminStats.teamMembers.toString(),
      bg: "#556ee6",
      link: "/dashboard/team"
    },
    {
      id: 2,
      title: "Total Products",
      number: loading ? "..." : adminStats.totalProducts.toString(),
      bg: "#34c38f",
      link: "/dashboard/products"
    },
    {
      id: 3,
      title: "Leads",
      number: loading ? "..." : adminStats.leads.toString(),
      bg: "#50a5f1",
      link: "/dashboard/leads"
    },
    {
      id: 4,
      title: "Careers",
      number: loading ? "..." : adminStats.careers.toString(),
      bg: "#f1b44c",
      link: "/dashboard/careers"
    },
  ];

  const userDashboardDetails = [
    {
      id: 1,
      title: "Cart Items",
      number: loading ? "..." : cartSummary.totalItems.toString(),
      bg: "#556ee6",
      link: "/dashboard/cart"
    },
    {
      id: 2,
      title: "Cart Value",
      number: loading ? "..." : `$${cartSummary.totalValue.toFixed(0)}`,
      bg: "#34c38f",
      link: "/dashboard/cart"
    },
    // {
    //   id: 3,
    //   title: "My Orders",
    //   number: "03",
    //   bg: "#50a5f1",
    //   link: "/dashboard/orders"
    // },
    // {
    //   id: 4,
    //   title: "Completed",
    //   number: "02",
    //   bg: "#f1b44c",
    //   link: "/dashboard/orders"
    // },
  ];

  const dashboardDetails = user?.role === 'Admin' ? adminDashboardDetails : userDashboardDetails;
  const welcomeMessage = user?.role === 'Admin' 
    ? 'Admin Dashboard - Manage your platform' 
    : 'User Dashboard - Track your progress';

  return (
    <>
      <h1 className="text-[60px] font-extrabold">Dashboard</h1>
      <p className="text-lg text-gray-600">{welcomeMessage}</p>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading dashboard data...</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {dashboardDetails.map((item) => (
          <Link
            href={item.link || '#'}
            key={item.id}
            className="block"
          >
            <div
              style={{ backgroundColor: item.bg, borderColor: item.bg }}
              className="border text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              <p className="text-2xl font-medium">{item.title}</p>
              <p className="text-3xl font-bold mt-2">{item.number}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Role-specific content */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {user?.role === 'Admin' ? (
          <>
            {/* Admin-specific widgets */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>{activity.message}</span>
                      <span className="text-sm text-gray-500">{activity.timeAgo}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>New user registered</span>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>Product updated</span>
                      <span className="text-sm text-gray-500">4 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>New lead generated</span>
                      <span className="text-sm text-gray-500">6 hours ago</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/dashboard/products" className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center">
                  Manage Products
                </Link>
                <Link href="/dashboard/team" className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center">
                  Manage Team
                </Link>
                <Link href="/dashboard/careers" className="p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-center">
                  Manage Careers
                </Link>
                <Link href="/dashboard/leads" className="p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-center">
                  View Leads
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* User-specific widgets */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">My Cart Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                  <span>Items in Cart</span>
                  <span className="text-lg font-bold text-blue-600">{cartSummary.totalItems}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <span>Total Value</span>
                  <span className="text-lg font-bold text-green-600">${cartSummary.totalValue.toFixed(2)}</span>
                </div>
                <Link 
                  href="/dashboard/cart" 
                  className="block w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
                >
                  View My Cart
                </Link>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <Link href="/shop" className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center">
                  Browse Products
                </Link>
                <Link href="/dashboard/cart" className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center">
                  View My Cart
                </Link>
                <Link href="/dashboard/profile" className="p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-center">
                  My Profile
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

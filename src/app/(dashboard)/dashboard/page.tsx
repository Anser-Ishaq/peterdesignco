'use client';

import { useAuth } from '@/app/hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();

  const adminDashboardDetails = [
    {
      id: 1,
      title: "Team Members",
      number: "05",
      bg: "#556ee6",
    },
    {
      id: 2,
      title: "Total Products",
      number: "05",
      bg: "#34c38f",
    },
    {
      id: 3,
      title: "Leads",
      number: "100",
      bg: "#50a5f1",
    },
    {
      id: 4,
      title: "Courses",
      number: "05",
      bg: "#f1b44c",
    },
  ];

  const userDashboardDetails = [
    {
      id: 1,
      title: "My Orders",
      number: "03",
      bg: "#556ee6",
    },
    {
      id: 2,
      title: "Completed Courses",
      number: "02",
      bg: "#34c38f",
    },
    {
      id: 3,
      title: "Active Projects",
      number: "01",
      bg: "#50a5f1",
    },
    {
      id: 4,
      title: "Messages",
      number: "12",
      bg: "#f1b44c",
    },
  ];

  const dashboardDetails = user?.role === 'Admin' ? adminDashboardDetails : userDashboardDetails;
  const welcomeMessage = user?.role === 'Admin' 
    ? 'Admin Dashboard - Manage your platform' 
    : 'User Dashboard - Track your progress';

  return (
    <>
      <h1 className="text-[60px] font-extrabold">Dashboard</h1>
      <p className="text-lg text-gray-600">{welcomeMessage}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {dashboardDetails.map((item) => (
          <div
            style={{ backgroundColor: item.bg, borderColor: item.bg }}
            key={item.id}
            className="border text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <p className="text-2xl font-medium">{item.title}</p>
            <p className="text-3xl font-bold mt-2">{item.number}</p>
          </div>
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
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Add Product
                </button>
                <button className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  Add Team Member
                </button>
                <button className="p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  Create Course
                </button>
                <button className="p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  View Reports
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* User-specific widgets */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">My Recent Orders</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Custom Furniture Design</span>
                  <span className="text-sm text-green-600 font-medium">Completed</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Interior Consultation</span>
                  <span className="text-sm text-yellow-600 font-medium">In Progress</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>3D Model Request</span>
                  <span className="text-sm text-blue-600 font-medium">Pending</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <button className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Place New Order
                </button>
                <button className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  View My Profile
                </button>
                <button className="p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  Browse Courses
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

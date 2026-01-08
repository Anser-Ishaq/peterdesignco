'use client';

import { useAuth } from '@/app/hooks/useAuth';
import Sidebar from '@/app/components/shared/sidebar';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Handle redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=' + encodeURIComponent(pathname));
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Handle role-based access control
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Define admin-only routes
      const adminOnlyRoutes = [
        '/dashboard/users',
        '/dashboard/team', 
        '/dashboard/products',
        '/dashboard/courses',
        '/dashboard/careers',
        '/dashboard/email-templates',
        '/dashboard/model-templates',
        '/dashboard/plans'
      ];

      // Check if current path is admin-only
      const isAdminRoute = adminOnlyRoutes.some(route => pathname.startsWith(route));
      
      if (isAdminRoute && user.role !== 'Admin') {
        // User doesn't have admin access, redirect to user dashboard
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, pathname, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show loading while redirecting
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Map user roles to sidebar roles
  const userRole = user.role === 'Admin' ? 'admin' : 'user';

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex">
      <Sidebar userRole={userRole} />
      <main className="flex-1 p-6">
        {/* User info header */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Welcome back, {user.name}!</h3>
            <p className="text-sm text-gray-600">
              Role: <span className="font-medium capitalize">{user.role}</span>
            </p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}

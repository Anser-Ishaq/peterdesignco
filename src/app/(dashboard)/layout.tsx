'use client';

import { useState } from 'react';
import Sidebar from '@/app/components/shared/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State for demo purposes - in real app, get this from your auth system
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <Sidebar userRole={userRole} />
      <main className="flex-1 p-6">
        {/* Role switcher for demo - remove in production */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Role Switcher (Demo)</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setUserRole('user')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                userRole === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              User View
            </button>
            <button
              onClick={() => setUserRole('admin')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                userRole === 'admin'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Admin View
            </button>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

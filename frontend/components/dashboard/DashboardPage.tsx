'use client';

import React from 'react';
import { UserProfile } from './UserProfile';
import { ApplicationCards } from './ApplicationCards';
import { AdminTools } from './AdminTools';
import { useAuth } from '@/hooks/useAuth';
import { USER_ROLES } from '@/lib/constants';

export const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();

  const isAdmin = user?.user_role === USER_ROLES.ADMIN;
  const isResearcher = user?.user_role === USER_ROLES.RESEARCHER;
  const hasAdminAccess = isAdmin || isResearcher;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Métis Nation of Ontario"
                className="h-10 w-auto"
              />
              <h1 className="ml-4 text-xl font-semibold text-gray-900">Registry Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Welcome,</div>
                <div className="font-medium text-gray-900">
                  {user?.given_name} {user?.family_name}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* User Profile Section */}
          <UserProfile />

          {/* Application Cards */}
          <ApplicationCards />

          {/* Admin Tools (if user has access) */}
          {hasAdminAccess && <AdminTools />}

          {/* Quick Stats for debugging - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-gray-900">
                Debug Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>User Object:</strong>
                  <pre className="mt-1 text-xs bg-white p-2 rounded overflow-auto text-gray-800">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserProfile } from './UserProfile';
import { ApplicationCards } from './ApplicationCards';
import { AdminTools } from './AdminTools';
import { useAuth } from '@/hooks/useAuth';
import { USER_ROLES } from '@/lib/constants';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const isAdmin = user?.user_role === USER_ROLES.ADMIN;
  const isResearcher = user?.user_role === USER_ROLES.RESEARCHER;
  const hasAdminAccess = isAdmin || isResearcher;

  return (
    <DashboardLayout showSidebar>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.given_name}! Manage your applications and profile.
          </p>
        </div>

        <div className="space-y-8">
          <UserProfile />

          <ApplicationCards />

          {hasAdminAccess && <AdminTools />}

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
      </div>
    </DashboardLayout>
  );
};
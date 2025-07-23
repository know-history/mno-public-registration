'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { ChevronLeft } from 'lucide-react';

interface UserAttributes {
  email: string;
  given_name?: string;
  family_name?: string;
  user_role?: string;
  email_verified?: boolean;
}

interface DashboardProps {
  onBackToLanding?: () => void;
}

export default function Dashboard({ onBackToLanding }: DashboardProps) {
  const { user, signOut } = useAuth();
  const [userAttributes, setUserAttributes] = useState<UserAttributes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserAttributes();
    }
  }, [user]);

  const fetchUserAttributes = async () => {
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken;
      
      if (idToken) {
        const payload = idToken.payload;
        setUserAttributes({
          email: payload.email as string,
          given_name: payload.given_name as string,
          family_name: payload.family_name as string,
          user_role: payload['custom:user_role'] as string,
          email_verified: payload.email_verified as boolean,
        });
      }
    } catch (error) {
      console.error('Error fetching user attributes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'researcher':
        return 'bg-blue-100 text-blue-800';
      case 'harvesting_admin':
        return 'bg-green-100 text-green-800';
      case 'harvesting_captain':
        return 'bg-purple-100 text-purple-800';
      case 'applicant':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRoleName = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'researcher':
        return 'Researcher';
      case 'harvesting_admin':
        return 'Harvesting Administrator';
      case 'harvesting_captain':
        return 'Harvesting Captain';
      case 'applicant':
        return 'Applicant';
      default:
        return 'Unknown';
    }
  };

  const handleBackToLanding = async () => {
    if (onBackToLanding) {
      onBackToLanding();
    } else {
      try {
        await signOut();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading user information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToLanding}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                <span className="text-sm font-medium">Back to Landing</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-black">Application Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Welcome,</div>
                <div className="font-medium text-gray-900">
                  {userAttributes?.given_name} {userAttributes?.family_name}
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(userAttributes?.user_role)}`}>
                {formatRoleName(userAttributes?.user_role)}
              </span>
              <button
                onClick={signOut}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* User Profile Card */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium mb-4 text-black">Your Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                <p className="mt-1 text-sm text-gray-900">
                  {userAttributes?.given_name} {userAttributes?.family_name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-sm text-gray-900">{userAttributes?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Role</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(userAttributes?.user_role)}`}>
                  {formatRoleName(userAttributes?.user_role)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  userAttributes?.email_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {userAttributes?.email_verified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>

          {/* Application Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-2">Address Update</h3>
              <p className="text-sm text-gray-600 mb-3">Update your current address or renew your citizen card</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 w-full">
                Start Application
              </button>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-2">Citizenship Application</h3>
              <p className="text-sm text-gray-600 mb-3">Apply for MNO citizenship</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 w-full">
                Start Application
              </button>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-2">Harvester Certificate</h3>
              <p className="text-sm text-gray-600 mb-3">Apply for a harvester's certificate</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 w-full">
                Start Application
              </button>
            </div>
          </div>

          {/* Current Applications */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium mb-4 text-black">Your Applications</h2>
            <div className="text-gray-500 text-center py-8">
              <p>No applications found.</p>
              <p className="text-sm mt-2">Start a new application using the options above.</p>
            </div>
          </div>

          {/* Admin Panel - Only show for admin users */}
          {userAttributes?.user_role === 'admin' && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium mb-4 text-black">Admin Panel</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-medium text-red-900 mb-2">Application Management</h3>
                  <p className="text-sm text-red-700 mb-3">Review and manage user applications</p>
                  <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                    Manage
                  </button>
                </div>
                
                {userAttributes?.user_role === 'admin' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-medium text-red-900 mb-2">User Management</h3>
                    <p className="text-sm text-red-700 mb-3">Manage user roles and permissions</p>
                    <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                      Manage
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Debug Info - Remove in production */}
          <div className="mt-8 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3 text-black">Debug Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>User Object:</strong>
                <pre className="mt-1 text-xs bg-white p-2 rounded overflow-auto text-black">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
              <div>
                <strong>User Attributes:</strong>
                <pre className="mt-1 text-xs bg-white p-2 rounded overflow-auto text-black">
                  {JSON.stringify(userAttributes, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { formatUserRole, getRoleBadgeColor } from '@/lib/utils';
import { clsx } from 'clsx';
import { User, Mail, BadgeCheck, AlertCircle } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <User className="w-5 h-5 mr-2" />
          Your Profile
        </h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-500">
              Full Name
            </label>
            <p className="text-lg font-medium text-gray-900">
              {user.given_name} {user.family_name}
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-500 flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              Email Address
            </label>
            <p className="text-lg text-gray-900">{user.email}</p>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-500">
              Role
            </label>
            <span className={clsx(
              'inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border',
              getRoleBadgeColor(user.user_role)
            )}>
              {formatUserRole(user.user_role)}
            </span>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-500">
              Email Status
            </label>
            <span className={clsx(
              'inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border',
              user.email_verified 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
            )}>
              {user.email_verified ? (
                <>
                  <BadgeCheck className="w-4 h-4 mr-1" />
                  Verified
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Unverified
                </>
              )}
            </span>
          </div>
        </div>

        {!user.email_verified && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Email Verification Required
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Please check your email and verify your account to access all features.
                </p>
                <div className="mt-3">
                  <button className="text-sm font-medium text-yellow-800 hover:text-yellow-900 underline">
                    Resend verification email
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
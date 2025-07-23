"use client";

import React, { useState } from "react";
import { ChevronDown, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { formatUserRole, getRoleBadgeColor } from "@/lib/utils";
import { clsx } from "clsx";

interface UserMenuProps {
  isMobile?: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = ({ isMobile = false }) => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (isMobile) {
    return (
      <div className="space-y-2">
        <div className="px-3 py-2">
          <div className="text-sm text-gray-500">Welcome,</div>
          <div className="font-medium text-gray-900">
            {user.given_name} {user.family_name}
          </div>
          <span
            className={clsx(
              "inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1",
              getRoleBadgeColor(user.user_role)
            )}
          >
            {formatUserRole(user.user_role)}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-2 space-y-1">
          <a
            href="/profile"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </a>
          <a
            href="/settings"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </a>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="text-right">
          <div className="text-sm text-gray-500">Welcome,</div>
          <div className="font-medium text-gray-900">
            {user.given_name} {user.family_name}
          </div>
        </div>
        <span
          className={clsx(
            "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
            getRoleBadgeColor(user.user_role)
          )}
        >
          {formatUserRole(user.user_role)}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <a
                href="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </a>
              <a
                href="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </a>
              <hr className="my-1 border-gray-200" />
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

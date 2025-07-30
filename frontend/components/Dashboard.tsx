"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  FileText,
  Bell,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  AlertCircle,
  Info,
  Settings,
} from "lucide-react";

import { ProfileSettings } from "./profile/ProfileSettings";
import { getDashboardUserData } from "@/app/actions/dashboard";

interface UserAttributes {
  email: string;
  given_name?: string;
  family_name?: string;
  middle_name?: string;
  user_role?: string;
  email_verified?: boolean;
  birth_date?: string;
  gender?: string;
  another_gender_value?: string;
}

interface DashboardProps {
  onBackToLanding?: () => void;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
    {children}
  </div>
);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendDirection,
}) => (
  <Card className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {trend && (
        <p
          className={`text-sm flex items-center mt-1 ${
            trendDirection === "up"
              ? "text-green-600"
              : trendDirection === "down"
                ? "text-red-600"
                : "text-gray-600"
          }`}
        >
          {trendDirection === "up" && <TrendingUp className="w-3 h-3 mr-1" />}
          {trend}
        </p>
      )}
    </div>
    <div className="text-blue-600">{icon}</div>
  </Card>
);

interface NotificationProps {
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  time: string;
}

const NotificationCard: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  time,
}) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getBgColor()}`}>
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{message}</p>
          <p className="text-xs text-gray-500 mt-2">{time}</p>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard({ onBackToLanding }: DashboardProps) {
  const { user, signOut } = useAuth();
  const [userAttributes, setUserAttributes] = useState<UserAttributes | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!user?.userId) return;

    try {
      const result = await getDashboardUserData(user.userId);

      if (result.success && result.data) {
        setUserAttributes(result.data);
      } else {
        console.error("Error fetching user data:", result.error);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  const getRoleBadgeColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "staff":
        return "bg-blue-100 text-blue-800";
      case "applicant":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatRoleName = (role?: string) => {
    if (!role) return "Unknown";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onBackToLanding?.();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading && !userAttributes) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={onBackToLanding}
                className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back,{" "}
                {userAttributes?.given_name || userAttributes?.email}!
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowProfileSettings(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Profile Settings"
              >
                <Settings className="w-6 h-6" />
              </button>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <Card>
            <h2 className="text-lg font-medium mb-4 text-black">
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium text-gray-700">
                  Full Name
                </label>
                <p className="mt-1 text-base text-gray-900">
                  {userAttributes?.given_name && userAttributes?.family_name
                    ? `${userAttributes.given_name} ${userAttributes.middle_name ? userAttributes.middle_name + " " : ""}${userAttributes.family_name}`
                    : "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <p className="text-base text-gray-900">
                    {userAttributes?.email || "Not provided"}
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      userAttributes?.email_verified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {userAttributes?.email_verified
                      ? "Verified"
                      : "Not Verified"}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700">
                  User Role
                </label>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getRoleBadgeColor(
                      userAttributes?.user_role
                    )}`}
                  >
                    {formatRoleName(userAttributes?.user_role)}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700">
                  Account Status
                </label>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                      userAttributes?.email_verified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {userAttributes?.email_verified
                      ? "Verified"
                      : "Not Verified"}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700">
                  Date of Birth
                </label>
                <p className="mt-1 text-base text-gray-900">
                  {userAttributes?.birth_date
                    ? new Date(
                        userAttributes.birth_date + "T12:00:00"
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not provided"}
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Applications"
              value="2"
              icon={<FileText className="w-8 h-8" />}
              trend="1 pending"
              trendDirection="neutral"
            />
            <StatCard
              title="Documents"
              value="5"
              icon={<Award className="w-8 h-8" />}
              trend="2 missing"
              trendDirection="down"
            />
            <StatCard
              title="Messages"
              value="3"
              icon={<Bell className="w-8 h-8" />}
              trend="1 unread"
              trendDirection="up"
            />
            <StatCard
              title="Profile"
              value="85%"
              icon={<Users className="w-8 h-8" />}
              trend="Complete"
              trendDirection="up"
            />
          </div>

          <Card>
            <h2 className="text-lg font-medium mb-4 text-black">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <NotificationCard
                type="success"
                title="Application Submitted"
                message="Your citizenship application has been successfully submitted."
                time="2 hours ago"
              />
              <NotificationCard
                type="warning"
                title="Document Required"
                message="Please upload your birth certificate to complete your application."
                time="1 day ago"
              />
              <NotificationCard
                type="info"
                title="Profile Updated"
                message="Your profile information has been updated successfully."
                time="3 days ago"
              />
            </div>
          </Card>

          {userAttributes?.user_role === "admin" && (
            <Card className="bg-red-50 border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Admin Access
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>You have administrative privileges.</p>
                  </div>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <button
                        type="button"
                        className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                      >
                        View Admin Panel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {userAttributes?.user_role === "staff" && (
            <Card className="bg-blue-50 border-blue-200">
              <div className="rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-blue-700">
                      You have staff access to manage applications and assist
                      users.
                    </p>
                    <p className="mt-3 text-sm md:mt-0 md:ml-6">
                      <button className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                        View Staff Dashboard
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {userAttributes?.user_role === "admin" && (
            <Card className="bg-red-100">
              <div className="p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                  <div>
                    <h3 className="text-base font-medium text-red-900 mb-2">
                      User Management
                    </h3>
                    <p className="text-sm text-red-700 mb-3">
                      Manage user roles and permissions
                    </p>
                    <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card className="bg-gray-100">
            <h3 className="text-lg font-medium mb-3 text-black">
              Debug Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>User Object:</strong>
                <pre className="mt-1 text-xs bg-white p-2 rounded overflow-auto text-black max-h-40">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
              <div>
                <strong>User Attributes (Database):</strong>
                <pre className="mt-1 text-xs bg-white p-2 rounded overflow-auto text-black max-h-40">
                  {JSON.stringify(userAttributes, null, 2)}
                </pre>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {showProfileSettings && (
        <ProfileSettings
          onClose={() => setShowProfileSettings(false)}
          onProfileUpdate={fetchUserData}
        />
      )}
    </div>
  );
}

"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Calendar,
  FileText,
  Bell,
  TrendingUp,
  Users,
  MapPin,
  Award,
  CheckCircle,
  AlertCircle,
  Info,
  Settings,
} from "lucide-react";

import { ProfileSettings } from "./profile/ProfileSettings";
import { VerifyEmailButton } from "./profile/VerifyEmailButton";
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

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const result = await getDashboardUserData(user!.userId);
      
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
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "researcher":
        return "bg-blue-100 text-blue-800";
      case "harvesting_admin":
        return "bg-green-100 text-green-800";
      case "harvesting_captain":
        return "bg-purple-100 text-purple-800";
      case "applicant":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatRoleName = (role?: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "researcher":
        return "Researcher";
      case "harvesting_admin":
        return "Harvesting Administrator";
      case "harvesting_captain":
        return "Harvesting Captain";
      case "applicant":
        return "Applicant";
      default:
        return "Unknown";
    }
  };

  const handleBackToLanding = async () => {
    if (onBackToLanding) {
      onBackToLanding();
    } else {
      try {
        await signOut();
      } catch (error) {
        console.error("Error signing out:", error);
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

  const recentActivities = [
    {
      type: "success",
      title: "Application Submitted",
      message:
        "Your citizenship application has been received and is under review.",
      time: "2 hours ago",
    },
    {
      type: "info",
      title: "Document Reminder",
      message: "Please upload your proof of residence by July 30, 2025.",
      time: "1 day ago",
    },
    {
      type: "warning",
      title: "Profile Update Required",
      message:
        "Your address information needs to be updated to maintain active status.",
      time: "3 days ago",
    },
  ];

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
                <span className="text-base font-medium">Back to Landing</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-black">
                Application Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:block text-right">
                <div className="text-base text-gray-500">Welcome,</div>
                <div className="font-medium text-gray-900">
                  {userAttributes?.given_name} {userAttributes?.family_name}
                </div>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(userAttributes?.user_role)}`}
              >
                {formatRoleName(userAttributes?.user_role)}
              </span>
              <button
                onClick={signOut}
                className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-red-700 text-sm sm:text-base font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-black">Your Profile</h2>
              <button
                onClick={() => setShowProfileSettings(true)}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-base text-gray-900">
                  {userAttributes?.email}
                </p>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700">
                  Full Name
                </label>
                <p className="mt-1 text-base text-gray-900">
                  {userAttributes?.given_name} {userAttributes?.middle_name} {userAttributes?.family_name}
                </p>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700">
                  Email Status
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      userAttributes?.email_verified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {userAttributes?.email_verified ? "Verified" : "Not Verified"}
                  </span>
                  {!userAttributes?.email_verified && (
                    <VerifyEmailButton
                      email={userAttributes?.email || ""}
                      onVerificationComplete={fetchUserData}
                    />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700">
                  User Role
                </label>
                <p className="mt-1 text-base text-gray-900">
                  {formatRoleName(userAttributes?.user_role)}
                </p>
              </div>
            </div>
          </Card>

          {/* Statistics Cards */}
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

          {/* Recent Activity */}
          <Card>
            <h2 className="text-lg font-medium mb-4 text-black">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((notification, index) => (
                <NotificationCard
                  key={index}
                  type={notification.type as "info" | "warning" | "success" | "error"}
                  title={notification.title}
                  message={notification.message}
                  time={notification.time}
                />
              ))}
            </div>
          </Card>

          {userAttributes?.user_role === "admin" && (
            <Card>
              <h2 className="text-lg font-medium mb-4 text-black">
                Admin Panel
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-medium text-red-900 mb-2">
                    Application Management
                  </h3>
                  <p className="text-sm text-red-700 mb-3">
                    Review and manage user applications
                  </p>
                  <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                    Manage
                  </button>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-medium text-red-900 mb-2">
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
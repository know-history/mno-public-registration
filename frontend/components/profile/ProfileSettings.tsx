"use client";

import React, { useState, useEffect } from "react";
import { User, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getUserWithPersonByCognitoSub } from "@/app/actions/users";
import { getGenderTypes } from "@/app/actions/profile";
import { ProfileForm } from "@/components/profile/forms/ProfileForm";
import { PasswordChangeForm } from "@/components/profile/forms/PasswordChangeForm";
import { AuthModal } from "@/components/ui/shared/AuthModal";

interface ProfileSettingsProps {
  onClose?: () => void;
  onProfileUpdate?: () => void;
}

interface UserData {
  user: {
    id: string;
    cognito_sub: string;
    email: string;
    status: string;
    persons: Array<{
      id: string;
      user_id: string | null;
      first_name: string;
      last_name: string;
      middle_name: string | null;
      birth_date: Date | null;
      gender_id: number | null;
      another_gender_value: string | null;
      gender_types: {
        id: number;
        code: string;
        html_value_en: string;
        html_value_fr: string;
      } | null;
    }>;
  };
  person: {
    id: string;
    user_id: string | null;
    first_name: string;
    last_name: string;
    middle_name: string | null;
    birth_date: Date | null;
    gender_id: number | null;
    another_gender_value: string | null;
    gender_types: {
      id: number;
      code: string;
      html_value_en: string;
      html_value_fr: string;
    } | null;
  } | null;
}

interface GenderType {
  id: number;
  code: string;
  html_value_en: string;
  html_value_fr: string;
}

type TabType = "profile" | "password";

export function ProfileSettings({
  onClose,
  onProfileUpdate,
}: ProfileSettingsProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [genderTypes, setGenderTypes] = useState<GenderType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [userResult, genderResult] = await Promise.all([
        getUserWithPersonByCognitoSub(user!.userId),
        getGenderTypes(),
      ]);

      if (userResult.success && userResult.data) {
        setUserData(userResult.data);
      }

      if (genderResult.success && genderResult.data) {
        setGenderTypes(genderResult.data);
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdateSuccess = () => {
    loadData();
    onProfileUpdate?.();
  };

  const getModalTitle = (): string => {
    const titles: Record<TabType, string> = {
      profile: "Edit Profile",
      password: "Change Password",
    };
    return titles[activeTab];
  };

  const getModalSubtitle = (): string => {
    const subtitles: Record<TabType, string> = {
      profile: "Update your personal information",
      password: "Update your password",
    };
    return subtitles[activeTab];
  };

  const TabButton = ({
    id,
    label,
    icon,
  }: {
    id: TabType;
    label: string;
    icon: React.ReactNode;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center justify-center space-x-1 px-2 sm:px-4 py-2 rounded-lg font-medium transition-colors flex-1 text-sm cursor-pointer ${
        activeTab === id
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden text-xs">{label}</span>
    </button>
  );

  if (loading) {
    return (
      <AuthModal
        onClose={onClose}
        title="Profile Settings"
        subtitle="Loading your profile information..."
        className="max-w-lg"
      >
        <div className="py-8 text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </AuthModal>
    );
  }

  return (
    <AuthModal
      onClose={onClose}
      title={getModalTitle()}
      subtitle={getModalSubtitle()}
      className="max-w-lg"
    >
      <div className="flex space-x-1 mb-6 p-1 bg-gray-50 rounded-lg">
        <TabButton
          id="profile"
          label="Profile"
          icon={<User className="w-4 h-4" />}
        />
        <TabButton
          id="password"
          label="Password"
          icon={<Lock className="w-4 h-4" />}
        />
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Account Email:</strong> {userData?.user?.email}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          This is your login email and cannot be changed through profile
          settings.
        </p>
      </div>

      <div className="space-y-6">
        {activeTab === "profile" && (
          <ProfileForm
            userId={user!.userId}
            initialData={{
              first_name: userData?.person?.first_name || "",
              last_name: userData?.person?.last_name || "",
              middle_name: userData?.person?.middle_name || "",
              birth_date: userData?.person?.birth_date
                ? new Date(userData.person.birth_date)
                    .toISOString()
                    .split("T")[0]
                : "",
              gender_id: userData?.person?.gender_id || undefined,
              another_gender_value:
                userData?.person?.another_gender_value || "",
            }}
            genderTypes={genderTypes}
            onSuccess={handleProfileUpdateSuccess}
          />
        )}

        {activeTab === "password" && <PasswordChangeForm />}
      </div>
    </AuthModal>
  );
}

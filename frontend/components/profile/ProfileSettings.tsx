"use client";

import React, { useState, useEffect, useCallback } from "react";
import { User, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getUserWithPersonByCognitoSub } from "@/app/actions/users";
import { getGenderTypes } from "@/app/actions/profile";
import { ProfileForm } from "@/components/profile/forms/ProfileForm";
import { PasswordChangeForm } from "@/components/profile/forms/PasswordChangeForm";
import { AuthModal } from "@/components/ui/shared/AuthModal";
import { type GenderType, type UserData } from "@/lib/auth";

interface ProfileSettingsProps {
  onClose?: () => void;
  onProfileUpdate?: () => void;
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

  const loadData = useCallback(async () => {
    if (!user?.userId) return;

    try {
      const [userResult, genderResult] = await Promise.all([
        getUserWithPersonByCognitoSub(user.userId),
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
  }, [user?.userId]);

  useEffect(() => {
    if (user?.userId) {
      loadData();
    }
  }, [user?.userId, loadData]);

  const handleProfileUpdateSuccess = useCallback(() => {
    loadData();
    onProfileUpdate?.();
  }, [loadData, onProfileUpdate]);

  if (loading) {
    return (
      <AuthModal
        title="Profile Settings"
        onClose={onClose}
        showCloseButton={true}
      >
        <div className="flex items-center justify-center py-8">
          <div className="text-lg">Loading...</div>
        </div>
      </AuthModal>
    );
  }

  const tabs = [
    { id: "profile" as TabType, label: "Profile", icon: User },
    { id: "password" as TabType, label: "Password", icon: Lock },
  ];

  return (
    <AuthModal
      title="Profile Settings"
      subtitle="Manage your account information and security"
      onClose={onClose}
      showCloseButton={true}
      className="max-w-2xl"
    >
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
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

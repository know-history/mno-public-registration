"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Lock, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getUserWithPersonByCognitoSub } from "@/app/actions/users";
import { getGenderTypes } from "@/app/actions/profile";
import { ProfileForm } from "@/components/profile/forms/ProfileForm";
import { EmailChangeForm } from "@/components/profile/forms/EmailChangeForm";
import { PasswordChangeForm } from "@/components/profile/forms/PasswordChangeForm";
import { EmailVerificationModal } from "@/components/profile/modals/EmailVerificationModal";

interface ProfileSettingsProps {
  onClose?: () => void;
}

export function ProfileSettings({ onClose }: ProfileSettingsProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'email' | 'password'>('profile');
  const [userData, setUserData] = useState<any>(null);
  const [genderTypes, setGenderTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  useEffect(() => {
    if (user?.userId) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [userResult, genderResult] = await Promise.all([
        getUserWithPersonByCognitoSub(user!.userId),
        getGenderTypes()
      ]);

      if (userResult.success) {
        setUserData(userResult.data);
      }
      
      if (genderResult.success) {
        setGenderTypes(genderResult.data);
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChangeSuccess = (newEmail: string) => {
    setPendingEmail(newEmail);
    setShowEmailVerification(true);
  };

  const handleEmailVerificationSuccess = () => {
    setShowEmailVerification(false);
    setPendingEmail("");
    loadData();
  };

  const TabButton = ({ 
    id, 
    label, 
    icon 
  }: { 
    id: 'profile' | 'email' | 'password'; 
    label: string; 
    icon: React.ReactNode;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-b">
            <div className="flex space-x-2">
              <TabButton id="profile" label="Profile" icon={<User className="w-4 h-4" />} />
              <TabButton id="email" label="Email" icon={<Mail className="w-4 h-4" />} />
              <TabButton id="password" label="Password" icon={<Lock className="w-4 h-4" />} />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <ProfileForm
                userId={user!.userId}
                initialData={{
                  first_name: userData?.person?.first_name || "",
                  last_name: userData?.person?.last_name || "",
                  birth_date: userData?.person?.birth_date 
                    ? new Date(userData.person.birth_date).toISOString().split('T')[0] 
                    : "",
                  gender_id: userData?.person?.gender_id || undefined,
                }}
                genderTypes={genderTypes}
                onSuccess={loadData}
              />
            )}

            {activeTab === 'email' && (
              <EmailChangeForm
                currentEmail={userData?.user?.email || ""}
                onSuccess={handleEmailChangeSuccess}
              />
            )}

            {activeTab === 'password' && (
              <PasswordChangeForm />
            )}
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      {showEmailVerification && (
        <EmailVerificationModal
          newEmail={pendingEmail}
          onSuccess={handleEmailVerificationSuccess}
          onCancel={() => {
            setShowEmailVerification(false);
            setPendingEmail("");
          }}
        />
      )}
    </>
  );
}
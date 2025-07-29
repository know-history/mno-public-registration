"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getUserWithPersonByCognitoSub } from "@/app/actions/users";
import { getGenderTypes } from "@/app/actions/profile";
import { ProfileForm } from "@/components/profile/forms/ProfileForm";
import { EmailChangeForm } from "@/components/profile/forms/EmailChangeForm";
import { PasswordChangeForm } from "@/components/profile/forms/PasswordChangeForm";
import { EmailVerificationModal } from "@/components/profile/modals/EmailVerificationModal";
import { AuthModal } from "@/components/ui/shared/AuthModal";

interface ProfileSettingsProps {
  onClose?: () => void;
  onProfileUpdate?: () => void;
}

export function ProfileSettings({ onClose, onProfileUpdate }: ProfileSettingsProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'email' | 'password'>('profile');
  const [userData, setUserData] = useState<any>(null);
  const [genderTypes, setGenderTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [emailChangeInProgress, setEmailChangeInProgress] = useState(false);

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
        setGenderTypes(genderResult.data || []);
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

  const handleEmailChangeSuccess = (newEmail: string) => {
    setPendingEmail(newEmail);
    setEmailChangeInProgress(true);
    setShowEmailVerification(true);
  };

  const handleEmailVerificationSuccess = () => {
    setShowEmailVerification(false);
    setPendingEmail("");
    setEmailChangeInProgress(false);
    loadData();
    onProfileUpdate?.();
    setTimeout(() => {
      if ((window as any).handleEmailChangeComplete) {
        (window as any).handleEmailChangeComplete();
      }
    }, 100);
  };

  const handleEmailVerificationCancel = async () => {
    if (emailChangeInProgress && pendingEmail) {
      try {
        const { markEmailAsUnverified } = await import("@/app/actions/email-verification");
        await markEmailAsUnverified(user!.userId, pendingEmail);
      } catch (error) {
        console.error("Failed to mark email as unverified:", error);
      }
    }
    
    setShowEmailVerification(false);
    setPendingEmail("");
    setEmailChangeInProgress(false);
    loadData();
    onProfileUpdate?.();
  };

  const getModalTitle = () => {
    switch (activeTab) {
      case 'profile':
        return 'Edit Profile';
      case 'email':
        return 'Change Email';
      case 'password':
        return 'Change Password';
      default:
        return 'Profile Settings';
    }
  };

  const getModalSubtitle = () => {
    switch (activeTab) {
      case 'profile':
        return 'Update your personal information';
      case 'email':
        return 'Change your email address';
      case 'password':
        return 'Update your password';
      default:
        return '';
    }
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
      className={`flex items-center justify-center space-x-1 px-2 sm:px-4 py-2 rounded-lg font-medium transition-colors flex-1 text-sm ${
        activeTab === id
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
    <>
      <AuthModal
        onClose={onClose}
        title={getModalTitle()}
        subtitle={getModalSubtitle()}
        className="max-w-lg"
      >
        <div className="flex space-x-1 mb-6 p-1 bg-gray-50 rounded-lg">
          <TabButton id="profile" label="Profile" icon={<User className="w-4 h-4" />} />
          <TabButton id="email" label="Email" icon={<Mail className="w-4 h-4" />} />
          <TabButton id="password" label="Password" icon={<Lock className="w-4 h-4" />} />
        </div>

        <div className="space-y-6">
          {activeTab === 'profile' && (
            <ProfileForm
              userId={user!.userId}
              initialData={{
                first_name: userData?.person?.first_name || "",
                last_name: userData?.person?.last_name || "",
                middle_name: userData?.person?.middle_name || "",
                birth_date: userData?.person?.birth_date 
                  ? new Date(userData.person.birth_date).toISOString().split('T')[0] 
                  : "",
                gender_id: userData?.person?.gender_id || undefined,
                another_gender_value: userData?.person?.another_gender_value || "",
              }}
              genderTypes={genderTypes}
              onSuccess={handleProfileUpdateSuccess}
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
      </AuthModal>

      {showEmailVerification && (
        <EmailVerificationModal
          newEmail={pendingEmail}
          onSuccess={handleEmailVerificationSuccess}
          onCancel={handleEmailVerificationCancel}
          isInitialVerification={emailChangeInProgress}
        />
      )}
    </>
  );
}
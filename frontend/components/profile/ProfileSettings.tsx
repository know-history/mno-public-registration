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

type TabType = 'profile' | 'email' | 'password';

export function ProfileSettings({ onClose, onProfileUpdate }: ProfileSettingsProps) {
  const { user, updateEmail } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [genderTypes, setGenderTypes] = useState<GenderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState(""); // Track original email for reverting
  const [showVerificationBanner, setShowVerificationBanner] = useState(false);

  useEffect(() => {
    if (user?.userId) {
      loadData();
      // Check if there's a pending email verification from previous session
      checkForPendingEmailVerification();
    }
  }, [user]);

  const checkForPendingEmailVerification = async () => {
    try {
      // Check if user has an unverified email that's different from what we expect
      const userResult = await getUserWithPersonByCognitoSub(user!.userId);
      if (userResult.success && userResult.data) {
        const dbUser = userResult.data.user;
        if (dbUser.status === "pending_verification" && dbUser.email) {
          // There's a pending email verification - show the banner
          setPendingEmail(dbUser.email);
          setShowVerificationBanner(true);
          
          // We need to figure out what the original email was
          // For now, we'll assume the database email before this change was the "current"
          // This is imperfect but works for the common case
          console.log("Found pending verification for:", dbUser.email);
        }
      }
    } catch (error) {
      console.error("Error checking pending verification:", error);
    }
  };

  const loadData = async () => {
    try {
      const [userResult, genderResult] = await Promise.all([
        getUserWithPersonByCognitoSub(user!.userId),
        getGenderTypes()
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

  const handleEmailChangeSuccess = (newEmail: string) => {
    // Store the original email before making the change
    const currentUserEmail = userData?.user?.email || "";
    setOriginalEmail(currentUserEmail);
    setPendingEmail(newEmail);
    setShowEmailVerification(true);
    
    console.log("Email change initiated:", { original: currentUserEmail, new: newEmail });
  };

  const handleEmailVerificationSuccess = () => {
    setShowEmailVerification(false);
    setPendingEmail("");
    setOriginalEmail("");
    setShowVerificationBanner(false);
    loadData();
    onProfileUpdate?.();
    
    // Trigger the email change completion callback
    if ((window as any).handleEmailChangeComplete) {
      (window as any).handleEmailChangeComplete();
    }
  };

  const handleEmailVerificationCancel = async () => {
    // When user cancels verification, we should NOT mark the new email as unverified
    // Instead, we should keep the original email and just show a banner for retry
    setShowEmailVerification(false);
    // Clear success messages from the form
    if ((window as any).handleEmailVerificationCancelled) {
      (window as any).handleEmailVerificationCancelled();
    }
    setShowVerificationBanner(true);
  };

  const handleRetryVerification = () => {
    setShowVerificationBanner(false);
    setShowEmailVerification(true);
  };

  const handleDismissVerificationBanner = async () => {
    // When user completely cancels, we revert the database back to original email
    // If we don't have originalEmail, we assume they want to cancel the change entirely
    const emailToRevertTo = originalEmail || ""; // This might be empty on page refresh
    
    if (pendingEmail) {
      try {
        if (emailToRevertTo) {
          // We know the original email - revert to it
          const { syncUserEmailWithCognito } = await import("@/app/actions/email");
          await syncUserEmailWithCognito(user!.userId, emailToRevertTo, true);
          console.log("Reverted database to original email:", emailToRevertTo);
        } else {
          // We don't know the original email - this is a problem
          // For now, just mark as needs manual intervention
          console.warn("Cannot revert email - original email unknown");
          // Could show an error message to user here
        }
        
        // Clear the success message from the form
        if ((window as any).handleEmailVerificationCancelled) {
          (window as any).handleEmailVerificationCancelled();
        }
      } catch (error) {
        console.error("Failed to revert email change:", error);
      }
    }
    
    setShowVerificationBanner(false);
    setPendingEmail("");
    setOriginalEmail("");
    loadData(); // This should refresh and show the reverted state
    onProfileUpdate?.();
  };

  const getModalTitle = (): string => {
    const titles: Record<TabType, string> = {
      profile: 'Edit Profile',
      email: 'Change Email',
      password: 'Change Password'
    };
    return titles[activeTab];
  };

  const getModalSubtitle = (): string => {
    const subtitles: Record<TabType, string> = {
      profile: 'Update your personal information',
      email: 'Change your email address',
      password: 'Update your password'
    };
    return subtitles[activeTab];
  };

  const TabButton = ({ 
    id, 
    label, 
    icon 
  }: { 
    id: TabType; 
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
          {/* Email verification warning banner */}
          {showVerificationBanner && pendingEmail && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Mail className="w-5 h-5 text-orange-600 mt-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-orange-800 mb-1">
                    Email Verification Pending
                  </h3>
                  <p className="text-sm text-orange-700 mb-3">
                    You didn't complete the verification for <strong>{pendingEmail}</strong>. 
                    Was this an accident? You can still verify your new email address.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleRetryVerification}
                      className="inline-flex items-center px-3 py-2 border border-orange-300 text-sm font-medium rounded-md text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Enter Verification Code
                    </button>
                    <button
                      onClick={handleDismissVerificationBanner}
                      className="text-sm text-orange-600 hover:text-orange-800 underline"
                    >
                      Cancel Email Change
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
              onEmailVerificationComplete={() => {
                console.log("Email verification complete callback ready");
              }}
              isVerificationPending={showVerificationBanner || showEmailVerification}
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
          isInitialVerification={true}
        />
      )}
    </>
  );
}
"use client";

import React, { useState } from "react";
import { Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { EmailVerificationModal } from "@/components/profile/modals/EmailVerificationModal";

interface VerifyEmailButtonProps {
  email: string;
  onVerificationComplete: () => void;
}

export function VerifyEmailButton({ email, onVerificationComplete }: VerifyEmailButtonProps) {
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateEmail } = useAuth();

  const handleVerifyNow = async () => {
    try {
      setLoading(true);
      await updateEmail(email);
      setShowVerificationModal(true);
    } catch (error: any) {
      console.log("Cognito response:", error.message);
      setShowVerificationModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    setShowVerificationModal(false);
    onVerificationComplete();
  };

  const handleVerificationCancel = () => {
    setShowVerificationModal(false);
  };

  return (
    <>
      <button
        onClick={handleVerifyNow}
        disabled={loading}
        className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
      >
        <Mail className="w-3 h-3" />
        <span>{loading ? "Opening..." : "Verify Now"}</span>
      </button>

      {showVerificationModal && (
        <EmailVerificationModal
          newEmail={email}
          onSuccess={handleVerificationSuccess}
          onCancel={handleVerificationCancel}
          isInitialVerification={false}
        />
      )}
    </>
  );
}
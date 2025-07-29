"use client";

import React, { useState } from "react";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { CodeInput, SubmitButton, ErrorAlert } from "@/components/ui/shared";
import { emailVerificationSchema, type EmailVerificationFormData } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

interface EmailVerificationModalProps {
  newEmail: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EmailVerificationModal({ newEmail, onSuccess, onCancel }: EmailVerificationModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const { confirmEmailUpdate } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (verificationCode.length !== 6) return;

  try {
    setLoading(true);
    setErrorMessage("");

    await confirmEmailUpdate(verificationCode);
    onSuccess();
    
  } catch (error: any) {
    let errorMsg = "Invalid verification code";
    
    if (error.name === 'CodeMismatchException') {
      errorMsg = "Invalid verification code. Please try again.";
    } else if (error.name === 'ExpiredCodeException') {
      errorMsg = "Verification code has expired. Please request a new one.";
    }
    
    setErrorMessage(errorMsg);
  } finally {
    setLoading(false);
  }
};

  const handleResendCode = async () => {
    try {
      setErrorMessage("");
      await profileAuthService.updateEmail(newEmail);
    } catch (error) {
      setErrorMessage("Failed to resend verification code");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Verify Your New Email</h3>
          <p className="mt-2 text-sm text-gray-500">
            We've sent a 6-digit verification code to <strong>{newEmail}</strong>. 
            Please enter the code below to complete the email change.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center">
            <CodeInput
              value={verificationCode}
              onChange={setVerificationCode}
              onComplete={(code) => {
                if (code.length === 6) {
                  setVerificationCode(code);
                }
              }}
              error={!!errorMessage}
            />
          </div>

          {errorMessage && <ErrorAlert message={errorMessage} />}

          <div className="flex flex-col space-y-3">
            <SubmitButton
              loading={loading}
              disabled={verificationCode.length !== 6 || loading}
              text="Verify Email"
              loadingText="Verifying..."
            />

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Resend Code
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import { Mail, X } from "lucide-react";
import {
  CodeInput,
  SubmitButton,
  ErrorAlert,
  SuccessAlert,
} from "@/components/ui/shared";
import { useAuth } from "@/hooks/useAuth";
import { updateUserEmailInDatabase } from "@/app/actions/email";
import { markEmailAsUnverified } from "@/app/actions/email-verification";
import { AuthModal } from "@/components/ui/shared/AuthModal";

interface EmailVerificationModalProps {
  newEmail: string;
  onSuccess: () => void;
  onCancel: () => void;
  isInitialVerification?: boolean;
}

export function EmailVerificationModal({
  newEmail,
  onSuccess,
  onCancel,
  isInitialVerification = true,
}: EmailVerificationModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const { confirmEmailUpdate, updateEmail, user } = useAuth();

  const dismissError = () => setErrorMessage("");
  const dismissSuccess = () => setSuccessMessage("");

  const handleCancel = async () => {
    if (isInitialVerification) {
      try {
        await markEmailAsUnverified(user!.userId, newEmail);
      } catch (error) {
        console.error("Failed to mark email as unverified:", error);
      }
    }
    onCancel();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (verificationCode.length !== 6) return;

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      await confirmEmailUpdate(verificationCode);

      if (isInitialVerification) {
        const dbResult = await updateUserEmailInDatabase(
          user!.userId,
          newEmail
        );
        if (!dbResult.success) {
          throw new Error(dbResult.error || "Failed to update database");
        }
      } else {
        const { verifyUserEmail } = await import(
          "@/app/actions/email-verification"
        );
        const dbResult = await verifyUserEmail(user!.userId);
        if (!dbResult.success) {
          throw new Error(dbResult.error || "Failed to verify email");
        }
      }

      setSuccessMessage("Email successfully updated!");

      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error: any) {
      let errorMsg = "Invalid verification code";

      if (error.name === "CodeMismatchException") {
        errorMsg = "Invalid verification code. Please try again.";
      } else if (error.name === "ExpiredCodeException") {
        errorMsg = "Verification code has expired. Please request a new one.";
      } else if (error.message?.includes("database")) {
        errorMsg =
          "Email verified in Cognito but failed to update database. Please contact support.";
      }

      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      await updateEmail(newEmail);
      setSuccessMessage("If a new code was needed, it has been sent!");
    } catch (error) {
      setSuccessMessage(
        "You can try using your existing verification code, or wait and request a new one later."
      );
    }
  };

  return (
    <AuthModal
      onClose={onCancel}
      title="Verify Your New Email"
      subtitle={`Enter the 6-digit code sent to ${newEmail}`}
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center">
          <CodeInput
            value={verificationCode}
            onChange={setVerificationCode}
            onComplete={(code) => {
              setVerificationCode(code);
              if (code.length === 6) {
                setTimeout(() => {
                  const form = document.querySelector("form");
                  if (form) {
                    form.dispatchEvent(
                      new Event("submit", { cancelable: true, bubbles: true })
                    );
                  }
                }, 100);
              }
            }}
            error={!!errorMessage}
          />
        </div>

        {successMessage && (
          <SuccessAlert message={successMessage} onDismiss={dismissSuccess} />
        )}

        {errorMessage && (
          <ErrorAlert message={errorMessage} onDismiss={dismissError} />
        )}

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
              disabled={loading}
            >
              Resend Code
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="text-sm text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </AuthModal>
  );
}

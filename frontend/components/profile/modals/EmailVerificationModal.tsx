"use client";

import React, { useState } from "react";
import {
  CodeInput,
  SubmitButton,
  ErrorAlert,
  SuccessAlert,
  ResendCodeButton,
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
  const [isCompleted, setIsCompleted] = useState(false);

  const { confirmEmailUpdate, updateEmail, user } = useAuth();

  const canSubmit = verificationCode.length === 6 && !isCompleted;

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

  const handleSubmit = async (e?: React.FormEvent, autoCode?: string) => {
    if (e) e.preventDefault();

    const codeToUse = autoCode || verificationCode;
    const canSubmitNow = codeToUse.length === 6;

    if (!canSubmitNow) return;

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      await confirmEmailUpdate(codeToUse);

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
      setIsCompleted(true);

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

  const handleAutoComplete = (code: string) => {
    if (code.length === 6) {
      handleSubmit(undefined, code);
    }
  };

  const handleResendCode = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      await updateEmail(newEmail);
    } catch (error) {
    }
  };

  return (
    <AuthModal
      onClose={handleCancel}
      title="Verify Your New Email"
      subtitle={`Enter the confirmation code that was sent to ${newEmail}`}
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <CodeInput
            value={verificationCode}
            onChange={setVerificationCode}
            onComplete={handleAutoComplete}
            error={!!errorMessage}
          />
        </div>

        <div className="text-center text-sm text-gray-600">
          It may take a minute to receive your code. Didn't receive it?{" "}
          <ResendCodeButton onResend={handleResendCode} />
        </div>

        {errorMessage && (
          <ErrorAlert message={errorMessage} onDismiss={dismissError} />
        )}

        {successMessage && (
          <SuccessAlert message={successMessage} onDismiss={dismissSuccess} />
        )}

        <SubmitButton
          loading={loading}
          disabled={!canSubmit || loading}
          text={isCompleted ? "Email Verified!" : "Verify Email"}
          loadingText="Verifying..."
        />
      </form>
    </AuthModal>
  );
}
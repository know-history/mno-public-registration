import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useErrorHandling, useRateLimiting } from "@/hooks/auth";
import { CodeInput, ErrorAlert, SuccessAlert, SubmitButton, ResendCodeButton } from "@/components/ui/shared";

interface ConfirmSignupFlowProps {
  email: string;
  onSuccess?: () => void;
  onBack?: () => void;
  successMessage?: string;
}

export function ConfirmSignupFlow({
  email,
  onSuccess,
  onBack,
  successMessage,
}: ConfirmSignupFlowProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { confirmSignUp, resendSignUpCode } = useAuth();
  
  const { errorMessage, hasError, dismissError, setError, clearError } = 
    useErrorHandling(undefined, { context: "signup" });
  
  const { canAttempt, recordAttempt } = useRateLimiting("confirm_signup");

  const handleCodeChange = (newCode: string[]) => {
    setCode(newCode);
    if (hasError) {
      clearError();
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting || !canAttempt) return;
    
    const codeString = code.join("");
    if (codeString.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      await confirmSignUp(email, codeString);
      recordAttempt(true);
      onSuccess?.();
    } catch (error) {
      recordAttempt(false);
      setError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    await resendSignUpCode(email);
  };

  const isCodeComplete = code.every(digit => digit !== "") && code.length === 6;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Check your email</h2>
        <p className="text-gray-600 mb-2">
          We sent a confirmation code to
        </p>
        <p className="font-medium text-gray-900">{email}</p>
      </div>

      <div className="space-y-6">
        {successMessage && (
          <SuccessAlert message={successMessage} />
        )}

        <div className="space-y-4">
          <CodeInput
            value={code}
            onChange={handleCodeChange}
            error={hasError}
            onComplete={() => isCodeComplete && handleSubmit()}
          />

          {hasError && (
            <ErrorAlert
              message={errorMessage}
              onDismiss={dismissError}
            />
          )}
        </div>

        <SubmitButton
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={!isCodeComplete || !canAttempt}
          type="button"
        >
          Confirm Account
        </SubmitButton>

        <ResendCodeButton
          onResend={handleResendCode}
          rateLimitKey="resend_signup_code"
        />

        {onBack && (
          <div className="text-center pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Back to sign up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
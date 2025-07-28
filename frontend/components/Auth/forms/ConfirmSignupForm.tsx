import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { CodeInput } from "@/components/ui/shared/CodeInput";
import { SubmitButton } from "@/components/ui/shared/SubmitButton";
import { ErrorAlert } from "@/components/ui/shared/ErrorAlert";
import { ResendCodeButton } from "@/components/ui/shared/ResendCodeButton";

interface ConfirmSignupFormProps {
  email: string;
  onSuccess: () => void;
}

export function ConfirmSignupForm({ email, onSuccess }: ConfirmSignupFormProps) {
  const { confirmSignUp, resendSignUpCode } = useAuth();
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [dismissibleError, setDismissibleError] = useState("");

  const canSubmit = confirmationCode.length === 6;

  const handleSubmit = async (e?: React.FormEvent, autoCode?: string) => {
    if (e) e.preventDefault();
    
    // Use autoCode if provided (for auto-complete), otherwise use state
    const codeToUse = autoCode || confirmationCode;
    const canSubmitNow = codeToUse.length === 6;
    
    console.log("HandleSubmit called, canSubmit:", canSubmitNow, "code:", codeToUse); // Debug log
    
    if (!canSubmitNow) {
      console.log("Cannot submit - code length:", codeToUse.length); // Debug log
      return;
    }

    try {
      setLoading(true);
      setDismissibleError("");

      console.log("Attempting to confirm signup with:", email, codeToUse); // Debug log
      await confirmSignUp(email, codeToUse);
      onSuccess();
    } catch (err: unknown) {
      let processedError = err instanceof Error ? err.message : "Confirmation failed";

      if (processedError.includes("CodeMismatchException")) {
        processedError = "Invalid confirmation code. Please try again.";
      } else if (processedError.includes("ExpiredCodeException")) {
        processedError = "Confirmation code has expired. Please request a new one.";
      } else if (processedError.includes("TooManyFailedAttemptsException")) {
        processedError = "Too many failed attempts. Please try again later.";
      }

      setDismissibleError(processedError);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoComplete = (code: string) => {
    console.log("HandleAutoComplete called with:", code, "length:", code.length); // Debug log
    // Auto-submit when 6 digits are entered
    if (code.length === 6) {
      console.log("Code is 6 digits, calling handleSubmit with code"); // Debug log
      // Pass the code directly to avoid state timing issues
      handleSubmit(undefined, code);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendSignUpCode(email);
      setDismissibleError("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to resend code";
      setDismissibleError(errorMessage);
    }
  };

  const dismissError = () => setDismissibleError("");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Code Input */}
      <div className="text-center">
        <CodeInput
          value={confirmationCode}
          onChange={setConfirmationCode}
          onComplete={handleAutoComplete}
          error={!!dismissibleError}
        />
      </div>

      {/* Resend Code */}
      <div className="text-center text-sm text-gray-600">
        It may take a minute to receive your code. Didn't receive it?{" "}
        <ResendCodeButton onResend={handleResendCode} />
      </div>

      {/* Dismissible Error */}
      {dismissibleError && (
        <ErrorAlert
          message={dismissibleError}
          onDismiss={dismissError}
        />
      )}

      {/* Submit Button */}
      <SubmitButton
        loading={loading}
        disabled={!canSubmit}
        text="Confirm"
        loadingText="Confirming..."
      />
    </form>
  );
}
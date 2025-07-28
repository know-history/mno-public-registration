import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { CodeInput } from "@/components/ui/shared/CodeInput";
import { SubmitButton } from "@/components/ui/shared/SubmitButton";
import { ErrorAlert } from "@/components/ui/shared/ErrorAlert";
import { ResendCodeButton } from "@/components/ui/shared/ResendCodeButton";
import { processAuthError } from "@/lib/auth/utils/errorHandling";

interface ConfirmSignupFormProps {
  email: string;
  onSuccess: () => void;
}

export function ConfirmSignupForm({
  email,
  onSuccess,
}: ConfirmSignupFormProps) {
  const { confirmSignUp, resendSignUpCode } = useAuth();
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [dismissibleError, setDismissibleError] = useState("");

  const canSubmit = confirmationCode.length === 6;

  const handleSubmit = async (e?: React.FormEvent, autoCode?: string) => {
    if (e) e.preventDefault();

    const codeToUse = autoCode || confirmationCode;
    const canSubmitNow = codeToUse.length === 6;

    if (!canSubmitNow) return;

    try {
      setLoading(true);
      setDismissibleError("");

      await confirmSignUp(email, codeToUse);
      onSuccess();
    } catch (err: unknown) {
      const processedError = processAuthError(err);
      setDismissibleError(processedError);
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
      await resendSignUpCode(email);
      setDismissibleError("");
    } catch (err: unknown) {
      const processedError = processAuthError(err);
      setDismissibleError(processedError);
    }
  };

  const dismissError = () => setDismissibleError("");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <CodeInput
          value={confirmationCode}
          onChange={setConfirmationCode}
          onComplete={handleAutoComplete}
          error={!!dismissibleError}
        />
      </div>

      <div className="text-center text-sm text-gray-600">
        It may take a minute to receive your code. Didn&#39;t receive it?{" "}
        <ResendCodeButton onResend={handleResendCode} />
      </div>

      {dismissibleError && (
        <ErrorAlert message={dismissibleError} onDismiss={dismissError} />
      )}

      <SubmitButton
        loading={loading}
        disabled={!canSubmit}
        text="Confirm"
        loadingText="Confirming..."
      />
    </form>
  );
}

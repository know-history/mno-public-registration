import React, { useState } from "react";
import { FormProvider } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useAuthForm } from "@/hooks/auth";
import { confirmSignupSchema } from "@/lib/auth/schemas";
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
  
  const { confirmSignUp, resendSignUpCode } = useAuth();
  
  const form = useAuthForm(confirmSignupSchema, {
    context: "signup",
    defaultValues: { email },
    onSuccess,
  });

  const handleConfirmSignup = async (data: {
    email: string;
    code: string;
  }) => {
    await confirmSignUp(data.email, data.code);
  };

  const handleResendCode = async () => {
    await resendSignUpCode(email);
  };

  const handleCodeChange = (newCode: string[]) => {
    setCode(newCode);
    form.setValue("code", newCode.join(""));
  };

  const handleBack = () => {
    const hasStartedCode = code.some(digit => digit !== "");
    
    if (hasStartedCode) {
      const confirmed = window.confirm(
        'You have started entering a confirmation code. Are you sure you want to go back to Sign Up? Your progress will be lost.'
      );
      if (!confirmed) return;
    }
    
    onBack?.();
  };

  const isCodeComplete = code.every(digit => digit !== "") && code.length === 6;

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        {successMessage && (
          <SuccessAlert message={successMessage} />
        )}

        <form onSubmit={form.handleAuthSubmit(handleConfirmSignup)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmation Code
            </label>
            <CodeInput
              value={code}
              onChange={handleCodeChange}
              error={!!form.formState.errors.code}
            />
            {form.formState.errors.code && (
              <p className="text-xs text-red-500 mt-1 px-1">
                {form.formState.errors.code.message}
              </p>
            )}
          </div>

          <ResendCodeButton
            onResend={handleResendCode}
            variant="link"
          />

          {form.hasError && (
            <ErrorAlert
              message={form.submitError}
              onDismiss={form.dismissError}
            />
          )}

          <SubmitButton
            loading={form.isSubmitting}
            disabled={!isCodeComplete}
            loadingText="Confirming Account..."
          >
            Confirm Account
          </SubmitButton>
        </form>
      </div>
    </FormProvider>
  );
}
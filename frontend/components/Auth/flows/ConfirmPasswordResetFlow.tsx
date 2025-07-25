import React, { useState } from "react";
import { FormProvider } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useAuthForm, usePasswordValidation } from "@/hooks/auth";
import { confirmPasswordResetSchema } from "@/lib/auth/schemas";
import { CodeInput, PasswordField, ErrorAlert, SuccessAlert, SubmitButton, ResendCodeButton } from "@/components/ui/shared";

interface ConfirmPasswordResetFlowProps {
  email: string;
  onSuccess?: () => void;
  onBack?: () => void;
  successMessage?: string;
}

export function ConfirmPasswordResetFlow({
  email,
  onSuccess,
  onBack,
  successMessage,
}: ConfirmPasswordResetFlowProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  
  const { confirmResetPassword, resetPassword } = useAuth();
  
  const form = useAuthForm(confirmPasswordResetSchema, {
    context: "reset",
    defaultValues: { email },
    onSuccess,
  });

  const password = form.watch("password");
  const { canSubmit } = usePasswordValidation(password);

  const handleConfirmReset = async (data: {
    email: string;
    code: string;
    password: string;
    password_confirmation: string;
  }) => {
    await confirmResetPassword(data.email, data.code, data.password);
  };

  const handleResendCode = async () => {
    await resetPassword(email);
  };

  const handleCodeChange = (newCode: string[]) => {
    setCode(newCode);
    form.setValue("code", newCode.join(""));
  };

  const isCodeComplete = code.every(digit => digit !== "") && code.length === 6;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset your password</h2>
        <p className="text-gray-600 mb-2">
          Enter the code sent to
        </p>
        <p className="font-medium text-gray-900">{email}</p>
      </div>

      <FormProvider {...form}>
        <div className="space-y-6">
          {successMessage && (
            <SuccessAlert message={successMessage} />
          )}

          <form onSubmit={form.handleAuthSubmit(handleConfirmReset)} className="space-y-6">
            <div className="space-y-4">
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
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.code.message}
                  </p>
                )}
              </div>

              <ResendCodeButton
                onResend={handleResendCode}
                rateLimitKey="resend_password_reset_code"
                variant="link"
              />
            </div>

            <PasswordField
              name="password"
              label="New Password"
              placeholder="Enter your new password"
              showRequirements={true}
              showStrength={true}
              required
            />

            <PasswordField
              name="password_confirmation"
              label="Confirm New Password"
              placeholder="Confirm your new password"
              required
            />

            {form.hasError && (
              <ErrorAlert
                message={form.submitError}
                onDismiss={form.dismissError}
              />
            )}

            <SubmitButton
              loading={form.isSubmitting}
              disabled={!isCodeComplete || !canSubmit || !form.formState.isValid}
            >
              Reset Password
            </SubmitButton>
          </form>

          {onBack && (
            <div className="text-center pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onBack}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Back to password reset
              </button>
            </div>
          )}
        </div>
      </FormProvider>
    </div>
  );
}
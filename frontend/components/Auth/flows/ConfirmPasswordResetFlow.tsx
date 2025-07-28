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
  const [showBackWarning, setShowBackWarning] = useState(false);
  
  const { confirmResetPassword, resetPassword } = useAuth();
  
  const form = useAuthForm(confirmPasswordResetSchema, {
    context: "reset",
    defaultValues: { email },
    onSuccess,
  });

  // Provide default empty string for password to prevent undefined error
  const password = form.watch("password") || "";
  const passwordConfirmation = form.watch("password_confirmation") || "";
  
  // Remove unused canSubmit
  // const { canSubmit } = usePasswordValidation(password);

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

  // This function handles the back button logic with confirmation
  const handleBackWithConfirmation = () => {
    // Check if user has started the reset process (entered code or password)
    const hasStartedReset = code.some(digit => digit !== "") || password || passwordConfirmation;
    
    if (hasStartedReset) {
      // Show warning and set error message
      form.setError("root", {
        type: "manual",
        message: 'Please complete the password reset process or use "Back to Forgot Password" to cancel.'
      });
      setShowBackWarning(true);
      return;
    }
    
    // If nothing entered, allow normal back navigation
    onBack?.();
  };

  const handleForceBack = () => {
    // User confirmed they want to go back despite warning
    setShowBackWarning(false);
    form.clearErrors();
    onBack?.();
  };

  const isCodeComplete = code.every(digit => digit !== "") && code.length === 6;

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        {successMessage && (
          <SuccessAlert message={successMessage} />
        )}

        <form onSubmit={form.handleAuthSubmit(handleConfirmReset)} className="space-y-6">
          {/* Confirmation Code Input */}
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

          {/* Resend Code Section */}
          <ResendCodeButton
            onResend={handleResendCode}
            variant="link"
          />

          {/* New Password Fields */}
          <PasswordField
            name="password"
            label="New Password"
            placeholder="Enter new password"
            showRequirements={true}
            showStrength={true}
            required
          />

          <PasswordField
            name="password_confirmation"
            label="Confirm New Password"
            placeholder="Confirm new password"
            required
          />

          {/* Show warning if user tries to go back with partial data */}
          {form.formState.errors.root && (
            <ErrorAlert
              message={form.formState.errors.root.message || ""}
              onDismiss={() => {
                form.clearErrors("root");
                setShowBackWarning(false);
              }}
            />
          )}

          {/* Show force back option if warning is active */}
          {showBackWarning && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleForceBack}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer underline"
              >
                Back to Forgot Password (cancel reset)
              </button>
            </div>
          )}

          <SubmitButton
            loading={form.isSubmitting}
            disabled={!form.formState.isValid || !isCodeComplete}
            loadingText="Resetting Password..."
          >
            Reset Password
          </SubmitButton>
        </form>
      </div>
    </FormProvider>
  );
}
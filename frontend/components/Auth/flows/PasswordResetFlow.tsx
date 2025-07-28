import React from "react";
import { FormProvider } from "react-hook-form";
import { Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthForm } from "@/hooks/auth";
import { forgotPasswordSchema } from "@/lib/auth/schemas";
import { FormField, ErrorAlert, SuccessAlert, SubmitButton } from "@/components/ui/shared";

interface PasswordResetFlowProps {
  onSuccess?: (email: string) => void;
  onSwitchToLogin?: () => void;
  successMessage?: string;
}

export function PasswordResetFlow({
  onSuccess,
  onSwitchToLogin,
  successMessage,
}: PasswordResetFlowProps) {
  const { resetPassword } = useAuth();
  
  const form = useAuthForm(forgotPasswordSchema, {
    context: "reset",
    onSuccess: (data) => {
      onSuccess?.(data.email);
    },
  });

  const handlePasswordReset = async (data: { email: string }) => {
    await resetPassword(data.email);
  };

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        {successMessage && (
          <SuccessAlert message={successMessage} />
        )}

        <form onSubmit={form.handleAuthSubmit(handlePasswordReset)} className="space-y-6">
          <FormField
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            icon={<Mail className="w-5 h-5" />}
            required
            autoComplete="email"
          />

          {form.hasError && (
            <ErrorAlert
              message={form.submitError}
              onDismiss={form.dismissError}
            />
          )}

          <SubmitButton
            loading={form.isSubmitting}
            disabled={!form.formState.isValid}
          >
            Send Reset Code
          </SubmitButton>
        </form>

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              Back to sign in
            </button>
          </p>
        </div>
      </div>
    </FormProvider>
  );
}
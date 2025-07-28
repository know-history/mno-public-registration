import React from "react";
import { FormProvider } from "react-hook-form";
import { Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthForm } from "@/hooks/auth";
import { loginSchema } from "@/lib/auth/schemas";
import { FormField, PasswordField, ErrorAlert, SuccessAlert, SubmitButton } from "@/components/ui/shared";

interface LoginFlowProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
  onSwitchToForgotPassword?: () => void;
  successMessage?: string;
}

export function LoginFlow({
  onSuccess,
  onSwitchToSignup,
  onSwitchToForgotPassword,
  successMessage,
}: LoginFlowProps) {
  const { signIn } = useAuth();
  
  const form = useAuthForm(loginSchema, {
    context: "login",
    onSuccess,
  });

  const handleLogin = async (data: { email: string; password: string }) => {
    await signIn(data.email, data.password);
  };

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        {successMessage && (
          <SuccessAlert message={successMessage} />
        )}

        <form onSubmit={form.handleAuthSubmit(handleLogin)} className="space-y-6">
          <FormField
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            icon={<Mail className="w-5 h-5" />}
            required
            autoComplete="email"
          />

          <PasswordField
            name="password"
            label="Password"
            placeholder="Enter your password"
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
            disabled={!form.formState.isValid}
            loadingText="Signing in..."
          >
            Sign In
          </SubmitButton>
        </form>

        <div className="mt-6 space-y-4">
          <div className="text-center">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 font-medium text-base transition-colors cursor-pointer"
              onClick={onSwitchToForgotPassword}
            >
              Forgot your password?
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-base">
              <span className="px-4 bg-white text-gray-500">New here?</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full py-3 text-base font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all cursor-pointer"
            onClick={onSwitchToSignup}
          >
            Create Account
          </button>
        </div>
      </div>
    </FormProvider>
  );
}
import React from "react";
import { FormProvider } from "react-hook-form";
import { Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthForm } from "@/hooks/auth";
import { loginSchema } from "@/lib/auth/schemas";
import {
  FormField,
  PasswordField,
  ErrorAlert,
  SuccessAlert,
  SubmitButton,
} from "@/components/ui/shared";

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
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <FormProvider {...form}>
        <div className="space-y-6">
          {successMessage && <SuccessAlert message={successMessage} />}

          <form
            onSubmit={form.handleAuthSubmit(handleLogin)}
            className="space-y-6"
          >
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
            >
              Sign In
            </SubmitButton>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              Forgot your password?
            </button>
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}

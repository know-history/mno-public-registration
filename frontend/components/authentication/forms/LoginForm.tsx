import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  FormField,
  PasswordField,
  SubmitButton,
  ErrorAlert,
  SuccessAlert,
} from "@/components/ui/shared";
import { loginSchema, type LoginFormData } from "@/lib/auth/schemas";
import {
  processAuthError,
  isConfirmationRequiredError,
} from "@/lib/auth/utils/errorHandling";

interface LoginFormProps {
  successMessage?: string;
  onSuccess?: () => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
  onConfirmationRequired?: (email: string) => void;
}

export function LoginForm({
  successMessage,
  onSuccess,
  onForgotPassword,
  onSignUp,
  onConfirmationRequired,
}: LoginFormProps) {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dismissibleError, setDismissibleError] = useState("");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const watchedFields = form.watch();
  const canSubmit = watchedFields.email && watchedFields.password;

  const handleSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setDismissibleError("");

      await signIn(data.email, data.password);
      onSuccess?.();
    } catch (err: unknown) {
      // Check if this is a confirmation required error
      if (isConfirmationRequiredError(err)) {
        // Navigate to confirmation flow instead of showing error
        onConfirmationRequired?.(data.email);
        return;
      }

      // For all other errors, show the processed error message
      const processedError = processAuthError(err);
      setDismissibleError(processedError);
    } finally {
      setLoading(false);
    }
  };

  const dismissError = () => setDismissibleError("");

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {successMessage && <SuccessAlert message={successMessage} />}

        <FormField
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          icon={<Mail className="w-5 h-5" />}
          disabled={loading}
          required
        />

        <PasswordField
          name="password"
          label="Password"
          placeholder="Enter password"
          disabled={loading}
          required
        />

        {dismissibleError && (
          <ErrorAlert message={dismissibleError} onDismiss={dismissError} />
        )}

        <SubmitButton
          loading={loading}
          disabled={!canSubmit}
          text="Login"
          loadingText="Logging in..."
        />

        <div className="text-center space-y-4">
          <button
            type="button"
            onClick={onForgotPassword}
            disabled={loading}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors cursor-pointer"
          >
            Forgot your password?
          </button>

          <div className="text-sm text-gray-600">
            Don&#39;t have an account?{" "}
            <button
              type="button"
              onClick={onSignUp}
              disabled={loading}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

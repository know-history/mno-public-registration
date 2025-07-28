import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { FormField } from "@/components/ui/shared/FormField";
import { PasswordField } from "@/components/ui/shared/PasswordField";
import { SubmitButton } from "@/components/ui/shared/SubmitButton";
import { ErrorAlert } from "@/components/ui/shared/ErrorAlert";
import { SuccessAlert } from "@/components/ui/shared/SuccessAlert";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  successMessage?: string;
  onSuccess?: () => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
}

export function LoginForm({
  successMessage,
  onSuccess,
  onForgotPassword,
  onSignUp,
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
      let processedError = err instanceof Error ? err.message : "Login failed";

      if (
        processedError.includes("NotAuthorizedException") ||
        processedError.includes("Incorrect username or password")
      ) {
        processedError = "Incorrect email or password";
      } else if (
        processedError.includes("UserNotConfirmedException") ||
        processedError.includes("not confirmed")
      ) {
        processedError =
          "Account not confirmed. Please check your email for confirmation code.";
      } else if (processedError.includes("UserNotFoundException")) {
        processedError = "User not found";
      } else if (processedError.includes("TooManyRequestsException")) {
        processedError = "Too many attempts. Please try again later.";
      }

      setDismissibleError(processedError);
    } finally {
      setLoading(false);
    }
  };

  const dismissError = () => setDismissibleError("");

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Success Message */}
        {successMessage && (
          <SuccessAlert message={successMessage} />
        )}

        {/* Email Field */}
        <FormField
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          icon={<Mail className="w-5 h-5" />}
          required
          autoComplete="email"
        />

        {/* Password Field */}
        <PasswordField
          name="password"
          label="Password"
          placeholder="Enter your password"
          required
          showRequirements={false}
        />

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
          text="Sign In"
          loadingText="Signing in..."
        />

        {/* Forgot Password Link */}
        <div className="text-center">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            Forgot your password?
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center text-sm text-gray-600">
          Don&#39;t have an account?{" "}
          <button
            type="button"
            onClick={onSignUp}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Sign up
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
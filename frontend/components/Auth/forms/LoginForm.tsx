import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  FormField,
  PasswordField,
  SubmitButton,
  ErrorAlert,
  SuccessAlert,
} from "@/components/ui/shared";

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
  const [error, setError] = useState("");
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
      setError("");
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
        {successMessage && <SuccessAlert message={successMessage} />}

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
          showRequirements={false}
        />

        {dismissibleError && (
          <ErrorAlert message={dismissibleError} onDismiss={dismissError} />
        )}

        <SubmitButton
          loading={loading}
          disabled={!canSubmit}
          text="Sign In"
          loadingText="Signing in..."
        />

        <div className="text-center">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors cursor-pointer"
          >
            Forgot your password?
          </button>
        </div>

        <div className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSignUp}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

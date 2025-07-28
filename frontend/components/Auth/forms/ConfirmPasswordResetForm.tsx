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
import { ResendCodeButton } from "@/components/ui/shared/ResendCodeButton";
import { PasswordRequirements } from "@/components/ui/shared/PasswordRequirements";

const confirmResetPasswordSchema = z
  .object({
    email: z.email("Invalid email address"),
    code: z.string().length(6, "Code must be 6 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type ConfirmForgotPasswordFormData = z.infer<typeof confirmResetPasswordSchema>;

interface ConfirmPasswordResetFormProps {
  email: string;
  onSuccess: () => void;
}

export function ConfirmPasswordResetForm({ email, onSuccess }: ConfirmPasswordResetFormProps) {
  const { confirmResetPassword, resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dismissibleError, setDismissibleError] = useState("");

  const form = useForm<ConfirmForgotPasswordFormData>({
    resolver: zodResolver(confirmResetPasswordSchema),
    defaultValues: {
      email: email,
      code: "",
      password: "",
      password_confirmation: "",
    },
  });

  const watchedFields = form.watch();
  const passwordsMatch = watchedFields.password === watchedFields.password_confirmation;
  const canSubmit = 
    watchedFields.email &&
    watchedFields.code?.length === 6 &&
    watchedFields.password &&
    watchedFields.password_confirmation &&
    passwordsMatch;

  const handleSubmit = async (data: ConfirmForgotPasswordFormData) => {
    try {
      setLoading(true);
      setDismissibleError("");

      await confirmResetPassword(data.email, data.code, data.password);
      onSuccess();
    } catch (err: unknown) {
      let processedError = err instanceof Error ? err.message : "Password reset failed";

      if (processedError.includes("CodeMismatchException")) {
        processedError = "Invalid confirmation code. Please try again.";
      } else if (processedError.includes("ExpiredCodeException")) {
        processedError = "Confirmation code has expired. Please request a new one.";
      } else if (processedError.includes("InvalidPasswordException")) {
        processedError = "Password does not meet requirements.";
      } else if (processedError.includes("TooManyFailedAttemptsException")) {
        processedError = "Too many failed attempts. Please try again later.";
      }

      setDismissibleError(processedError);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await resetPassword(email);
      setDismissibleError("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to resend code";
      setDismissibleError(errorMessage);
    }
  };

  const dismissError = () => setDismissibleError("");

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Email Field - Read Only */}
        <FormField
          name="email"
          type="email"
          label="Email"
          icon={<Mail className="w-5 h-5" />}
          disabled={true}
          className="opacity-75"
        />

        {/* Confirmation Code */}
        <FormField
          name="code"
          label="Confirmation Code"
          placeholder="Enter 6-digit code"
          required
          className="text-center"
        />

        {/* Resend Code */}
        <div className="text-center text-sm text-gray-600">
          It may take a minute to receive your code. Didn&#39;t receive it?{" "}
          <ResendCodeButton onResend={handleResendCode} />
        </div>

        {/* New Password */}
        <PasswordField
          name="password"
          label="New Password"
          placeholder="Enter new password"
          required
          showRequirements={true}
        />

        {/* Confirm New Password */}
        <PasswordField
          name="password_confirmation"
          label="Confirm New Password"
          placeholder="Confirm new password"
          required
          showRequirements={false}
        />

        {/* Password Match Warning */}
        {!passwordsMatch && watchedFields.password_confirmation && (
          <div className="text-red-600 text-sm ml-1 flex items-center">
            <span className="mr-2">⚠️</span>
            Passwords do not match.
          </div>
        )}

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
          text="Reset Password"
          loadingText="Resetting password..."
        />
      </form>
    </FormProvider>
  );
}
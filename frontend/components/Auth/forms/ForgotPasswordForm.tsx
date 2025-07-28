import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  FormField,
  SubmitButton,
  ErrorAlert,
  SuccessAlert,
} from "@/components/ui/shared";

const resetPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dismissibleError, setDismissibleError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const watchedFields = form.watch();
  const canSubmit = watchedFields.email;

  const handleSubmit = async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);
      setDismissibleError("");
      setSuccessMessage("");

      await resetPassword(data.email);

      setSuccessMessage("Password reset code sent! Check your email.");

      setTimeout(() => {
        onSuccess(data.email);
      }, 1500);
    } catch (err: unknown) {
      let processedError =
        err instanceof Error ? err.message : "Failed to send reset code";

      if (processedError.includes("UserNotFoundException")) {
        processedError = "No account found with this email address";
      } else if (processedError.includes("LimitExceededException")) {
        processedError = "Too many requests. Please try again later.";
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
          placeholder="Enter your email address"
          icon={<Mail className="w-5 h-5" />}
          required
          autoComplete="email"
        />

        {dismissibleError && (
          <ErrorAlert message={dismissibleError} onDismiss={dismissError} />
        )}

        <SubmitButton
          loading={loading}
          disabled={!canSubmit}
          text="Send Reset Code"
          loadingText="Sending code..."
        />
      </form>
    </FormProvider>
  );
}

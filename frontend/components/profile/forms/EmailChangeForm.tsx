"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail } from "lucide-react";
import {
  FormField,
  SubmitButton,
  ErrorAlert,
  SuccessAlert,
} from "@/components/ui/shared";
import { useAuth } from "@/hooks/useAuth";
import { checkEmailExists } from "@/app/actions/email";

const emailChangeSchema = z.object({
  new_email: z.string().email("Please enter a valid email address"),
});

type EmailChangeFormData = z.infer<typeof emailChangeSchema>;

interface EmailChangeFormProps {
  currentEmail: string;
  onSuccess: (newEmail: string) => void;
  onEmailVerificationComplete?: () => void;
  isVerificationPending?: boolean;
  originalEmail?: string; // The email before any changes were made
}

export function EmailChangeForm({ 
  currentEmail, 
  onSuccess, 
  onEmailVerificationComplete,
  isVerificationPending = false,
  originalEmail
}: EmailChangeFormProps) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [localVerificationPending, setLocalVerificationPending] = useState(isVerificationPending);

  const { updateEmail } = useAuth();

  const form = useForm<EmailChangeFormData>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      new_email: "",
    },
  });

  const watchedFields = form.watch();
  const verificationPending = isVerificationPending || localVerificationPending;
  const canSubmit = watchedFields.new_email && !verificationPending;

  const dismissError = () => setErrorMessage("");
  const dismissSuccess = () => setSuccessMessage("");

  // Reset form when email verification is complete
  React.useEffect(() => {
    if (onEmailVerificationComplete) {
      const handleEmailVerificationComplete = () => {
        form.reset();
        setSuccessMessage("");
        setErrorMessage("");
        setLocalVerificationPending(false);
        setLoading(false);
      };

      // Set up global callback for email verification completion
      (window as any).handleEmailChangeComplete = handleEmailVerificationComplete;
      
      return () => {
        delete (window as any).handleEmailChangeComplete;
      };
    }
  }, [onEmailVerificationComplete, form]);

  // Reset form when verification is cancelled (from ProfileSettings)
  React.useEffect(() => {
    const handleEmailVerificationCancelled = () => {
      setSuccessMessage(""); // Clear the green banner
      setErrorMessage("");
      setLocalVerificationPending(false); // Re-enable the form
      setLoading(false);
    };

    (window as any).handleEmailVerificationCancelled = handleEmailVerificationCancelled;
    
    return () => {
      delete (window as any).handleEmailVerificationCancelled;
    };
  }, []);

  // Sync with parent verification state
  React.useEffect(() => {
    setLocalVerificationPending(isVerificationPending);
  }, [isVerificationPending]);

  const handleSubmit = async (data: EmailChangeFormData) => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const newEmailNormalized = data.new_email.toLowerCase().trim();
      const currentEmailNormalized = currentEmail.toLowerCase().trim();

      if (newEmailNormalized === currentEmailNormalized) {
        setErrorMessage("New email must be different from your current email");
        return;
      }

      // Check if email already exists
      const emailCheck = await checkEmailExists(newEmailNormalized);
      if (!emailCheck.success) {
        setErrorMessage(emailCheck.error || "Failed to validate email");
        return;
      }

      if (emailCheck.exists) {
        setErrorMessage("This email address is already in use by another account");
        return;
      }

      // Initiate email change
      await updateEmail(data.new_email);

      setSuccessMessage("Verification code sent to your new email address!");
      setLocalVerificationPending(true); // Disable form
      form.clearErrors();

      // Trigger the verification modal after a brief delay
      setTimeout(() => {
        onSuccess(data.new_email);
      }, 1000);

    } catch (error: any) {
      let errorMsg = "Failed to change email";

      if (error.name === "InvalidParameterException") {
        errorMsg = "Invalid email address format";
      } else if (error.name === "AliasExistsException") {
        errorMsg = "This email address is already registered with AWS Cognito";
      } else if (error.name === "NotAuthorizedException") {
        errorMsg = "Authentication failed. Please try signing out and back in.";
      } else if (error.name === "LimitExceededException") {
        errorMsg = "Too many requests. Please try again later.";
      }

      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Current Email:</strong> {originalEmail || currentEmail}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          A verification code will be sent to your new email address. The change
          will take effect after verification.
        </p>
      </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {successMessage && (
            <SuccessAlert message={successMessage} onDismiss={dismissSuccess} />
          )}
          {errorMessage && (
            <ErrorAlert message={errorMessage} onDismiss={dismissError} />
          )}

          <FormField
            name="new_email"
            type="email"
            label="New Email Address"
            placeholder="Enter your new email address"
            icon={<Mail className="w-5 h-5" />}
            disabled={verificationPending}
            required
          />

          <div className="flex justify-end">
            <SubmitButton
              loading={loading}
              disabled={loading || !canSubmit}
              text={verificationPending ? "Verification Pending" : "Change Email"}
              loadingText="Processing..."
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
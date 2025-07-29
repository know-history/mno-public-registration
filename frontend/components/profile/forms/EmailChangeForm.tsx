"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail } from "lucide-react";
import { FormField, PasswordField, SubmitButton, ErrorAlert, SuccessAlert } from "@/components/ui/shared";
import { useAuth } from "@/hooks/useAuth";
import { checkEmailExists } from "@/app/actions/email";

const emailChangeSchema = z.object({
  new_email: z.string().email("Please enter a valid email address"),
  current_password: z.string().min(1, "Current password is required"),
});

type EmailChangeFormData = z.infer<typeof emailChangeSchema>;

interface EmailChangeFormProps {
  currentEmail: string;
  onSuccess: (newEmail: string) => void;
  onEmailChangeComplete?: () => void; // Called when email change is fully completed
}

export function EmailChangeForm({ currentEmail, onSuccess, onEmailChangeComplete }: EmailChangeFormProps) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailChangeInProgress, setEmailChangeInProgress] = useState(false);
  const [emailChangeCompleted, setEmailChangeCompleted] = useState(false);

  const { updateEmail } = useAuth();

  const form = useForm<EmailChangeFormData>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      new_email: "",
      current_password: "",
    },
  });

  const watchedFields = form.watch();
  const canSubmit = watchedFields.new_email && watchedFields.current_password && !emailChangeInProgress;

  // Reset form state when email change is completed
  React.useEffect(() => {
    if (onEmailChangeComplete) {
      // This will be called when email verification is completed
      const handleEmailChangeComplete = () => {
        setEmailChangeInProgress(false);
        setEmailChangeCompleted(true);
        setSuccessMessage("Email successfully changed!");
        form.reset();
      };
      
      // Store the handler so ProfileSettings can call it
      (window as any).handleEmailChangeComplete = handleEmailChangeComplete;
    }
  }, [onEmailChangeComplete, form]);

  const dismissError = () => setErrorMessage("");
  const dismissSuccess = () => {
    setSuccessMessage("");
    setEmailChangeCompleted(false);
  };

  const handleSubmit = async (data: EmailChangeFormData) => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      // Normalize emails for comparison
      const newEmailNormalized = data.new_email.toLowerCase().trim();
      const currentEmailNormalized = currentEmail.toLowerCase().trim();

      // Check if the new email is the same as current email
      if (newEmailNormalized === currentEmailNormalized) {
        setErrorMessage("New email must be different from your current email");
        return;
      }

      // Check if email already exists in database
      const emailCheck = await checkEmailExists(newEmailNormalized);
      if (!emailCheck.success) {
        setErrorMessage(emailCheck.error || "Failed to validate email");
        return;
      }

      if (emailCheck.exists) {
        setErrorMessage("This email address is already in use by another account");
        return;
      }

      // Proceed with Cognito email update
      await updateEmail(data.new_email);
      
      setSuccessMessage("Verification code sent to your new email address!");
      setEmailChangeInProgress(true); // Disable form while email change is in progress
      form.clearErrors(); // Clear any validation errors
      
      // Small delay to show success message before opening verification modal
      setTimeout(() => {
        onSuccess(data.new_email);
      }, 1000);
      
    } catch (error: any) {
      let errorMsg = "Failed to change email";
      
      if (error.name === 'InvalidParameterException') {
        errorMsg = "Invalid email address format";
      } else if (error.name === 'AliasExistsException') {
        errorMsg = "This email address is already registered with AWS Cognito";
      } else if (error.name === 'NotAuthorizedException') {
        errorMsg = "Current password is incorrect";
      } else if (error.name === 'LimitExceededException') {
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
          <strong>Current Email:</strong> {currentEmail}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          A verification code will be sent to your new email address.
          The change will take effect after verification.
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
            required
          />
          
          <PasswordField
            name="current_password"
            label="Current Password"
            placeholder="Enter your current password to confirm"
            required
          />

          <div className="flex justify-end">
            <SubmitButton
              loading={loading}
              disabled={loading || !canSubmit || emailChangeCompleted}
              text={emailChangeCompleted ? "Email Changed" : "Change Email"}
              loadingText="Processing..."
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
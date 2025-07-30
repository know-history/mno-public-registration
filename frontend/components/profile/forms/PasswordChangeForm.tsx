"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PasswordField,
  SubmitButton,
  ErrorAlert,
  SuccessAlert,
} from "@/components/ui/shared";
import { passwordChangeSchema, type PasswordChangeFormData } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

interface PasswordChangeFormProps {
  onSuccess?: () => void;
}

export function PasswordChangeForm({ onSuccess }: PasswordChangeFormProps) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { changePassword } = useAuth();

  const form = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    mode: "onChange", // This enables real-time validation
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  // Watch all form fields for validation
  const watchedFields = form.watch();
  const { formState } = form;

  // Check if form is valid and all fields are filled
  const isFormValid =
    watchedFields.current_password &&
    watchedFields.new_password &&
    watchedFields.confirm_password &&
    watchedFields.new_password === watchedFields.confirm_password &&
    watchedFields.current_password.length >= 8 && // Basic length check
    watchedFields.new_password.length >= 8 && // Basic length check
    Object.keys(formState.errors).length === 0; // No validation errors

  const dismissError = () => setErrorMessage("");
  const dismissSuccess = () => setSuccessMessage("");

  const handleSubmit = async (data: PasswordChangeFormData) => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      await changePassword(data.current_password, data.new_password);

      setSuccessMessage("Password changed successfully!");
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      let errorMsg = "Failed to change password";

      if (error.name === "NotAuthorizedException") {
        errorMsg = "Current password is incorrect";
      } else if (error.name === "InvalidPasswordException") {
        errorMsg = "New password does not meet requirements";
      } else if (error.name === "LimitExceededException") {
        errorMsg = "Too many attempts. Please try again later.";
      }

      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {successMessage && (
            <SuccessAlert message={successMessage} onDismiss={dismissSuccess} />
          )}
          {errorMessage && (
            <ErrorAlert message={errorMessage} onDismiss={dismissError} />
          )}

          <PasswordField
            name="current_password"
            label="Current Password"
            placeholder="Enter your current password"
            required
          />

          <PasswordField
            name="new_password"
            label="New Password"
            placeholder="Enter your new password"
            required
            showRequirements
          />

          <PasswordField
            name="confirm_password"
            label="Confirm New Password"
            placeholder="Confirm your new password"
            required
          />

          {watchedFields.new_password &&
            watchedFields.confirm_password &&
            watchedFields.new_password !== watchedFields.confirm_password && (
              <div className="text-red-600 text-sm ml-1 flex items-center">
                <span className="mr-2">⚠️</span>
                Passwords do not match.
              </div>
            )}

          <div className="flex justify-end">
            <SubmitButton
              loading={loading}
              disabled={loading || !isFormValid}
              text="Change Password"
              loadingText="Changing..."
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

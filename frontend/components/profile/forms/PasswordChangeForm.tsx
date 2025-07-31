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
import {
  passwordChangeSchema,
  type PasswordChangeFormData,
  type AuthError,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "@/lib/auth";
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
    mode: "onChange",
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const watchedFields = form.watch();
  const { formState } = form;

  const isFormValid =
    watchedFields.current_password &&
    watchedFields.new_password &&
    watchedFields.confirm_password &&
    watchedFields.new_password === watchedFields.confirm_password &&
    watchedFields.current_password.length >= 8 &&
    watchedFields.new_password.length >= 8 &&
    Object.keys(formState.errors).length === 0;

  const dismissError = () => setErrorMessage("");
  const dismissSuccess = () => setSuccessMessage("");

  const handleSubmit = async (data: PasswordChangeFormData) => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      await changePassword(data.current_password, data.new_password);

      setSuccessMessage(SUCCESS_MESSAGES.PASSWORD_CHANGED);
      form.reset();
      onSuccess?.();
    } catch (error) {
      const authError = error as AuthError;
      let errorMsg;

      if (authError.name === "NotAuthorizedException") {
        errorMsg = ERROR_MESSAGES.CURRENT_PASSWORD_INCORRECT;
      } else if (authError.name === "InvalidPasswordException") {
        errorMsg = ERROR_MESSAGES.PASSWORD_REQUIREMENTS_NOT_MET;
      } else if (authError.name === "LimitExceededException") {
        errorMsg = ERROR_MESSAGES.TOO_MANY_REQUESTS;
      } else {
        errorMsg = ERROR_MESSAGES.PASSWORD_CHANGE_FAILED;
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

"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
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
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

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
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800">
          Password must be at least 8 characters and include uppercase,
          lowercase, numbers, and special characters.
        </p>
      </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {successMessage && <SuccessAlert message={successMessage} />}
          {errorMessage && <ErrorAlert message={errorMessage} />}

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

          <div className="flex justify-end">
            <SubmitButton
              loading={loading}
              disabled={loading}
              text="Change Password"
              loadingText="Changing..."
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

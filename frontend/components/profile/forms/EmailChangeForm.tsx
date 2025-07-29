"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { FormField, PasswordField, SubmitButton, ErrorAlert, SuccessAlert } from "@/components/ui/shared";
import { emailChangeSchema, type EmailChangeFormData } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

interface EmailChangeFormProps {
  currentEmail: string;
  onSuccess: (newEmail: string) => void;
}

export function EmailChangeForm({ currentEmail, onSuccess }: EmailChangeFormProps) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { updateEmail } = useAuth();

  const form = useForm<EmailChangeFormData>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      new_email: "",
      current_password: "",
    },
  });

  const handleSubmit = async (data: EmailChangeFormData) => {
  try {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    await updateEmail(data.new_email);
    
    setSuccessMessage("Verification code sent to your new email address!");
    form.reset();
    
    onSuccess(data.new_email);
    
  } catch (error: any) {
    let errorMsg = "Failed to change email";
    
    if (error.name === 'InvalidParameterException') {
      errorMsg = "Invalid email address";
    } else if (error.name === 'AliasExistsException') {
      errorMsg = "This email address is already in use";
    } else if (error.name === 'NotAuthorizedException') {
      errorMsg = "Current password is incorrect";
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
          {successMessage && <SuccessAlert message={successMessage} />}
          {errorMessage && <ErrorAlert message={errorMessage} />}

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
              disabled={loading}
              text="Change Email"
              loadingText="Processing..."
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
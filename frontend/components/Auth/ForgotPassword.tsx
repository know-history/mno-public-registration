import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ResetPasswordFormData } from "@/components/Auth/LoginForm";
import { X, AlertCircle } from "lucide-react";

interface ForgotPasswordProps {
  form: UseFormReturn<ResetPasswordFormData>;
  loading: boolean;
  error: string;
  onSubmit: (data: ResetPasswordFormData) => Promise<void>;
  onBack: () => void;
  onClose?: () => void;
}

export default function ForgotPassword({
  form,
  loading,
  error,
  onSubmit,
  onBack,
  onClose,
}: ForgotPasswordProps) {
  const [dismissibleError, setDismissibleError] = useState<string>("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (onClose) {
          onClose();
        } else {
          onBack();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onBack, onClose]);

  useEffect(() => {
    if (error) {
      let processedError = error;

      if (error.includes("UserNotFoundException")) {
        processedError = "User not found";
      } else if (error.includes("LimitExceededException")) {
        processedError = "Too many attempts. Please try again later.";
      } else if (error.includes("InvalidParameterException")) {
        processedError = "Invalid email address";
      }

      setDismissibleError(processedError);
    } else {
      setDismissibleError("");
    }
  }, [error]);

  const handleCloseClick = () => {
    if (onClose) {
      onClose();
    } else {
      onBack();
    }
  };

  const dismissError = () => {
    setDismissibleError("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto px-4 py-8">
      <button
        onClick={handleCloseClick}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-md mx-auto mt-12 space-y-6">
        <div className="text-center">
          <h4 className="text-3xl text-[#333] font-bold">Reset Password</h4>
          <p className="text-sm text-[#333] mt-4">
            Please enter your email address.
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-1">
            <input
              {...form.register("email")}
              type="email"
              placeholder="Email address *"
              className="px-4 py-3 w-full border border-gray-300 rounded-lg text-[#333] placeholder-gray-500"
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500 ml-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {dismissibleError && (
            <div
              className="flex items-center bg-red-100 text-red-800 p-3 rounded-lg relative"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium flex-1">
                {dismissibleError}
              </span>
              <button
                onClick={dismissError}
                className="ml-3 flex-shrink-0 hover:bg-red-200 rounded-lg transition-all p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium"
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>

        <button
          type="button"
          onClick={onBack}
          className="text-blue-600 text-center hover:underline block w-full"
        >
          Back to login
        </button>
      </div>
    </div>
  );
}

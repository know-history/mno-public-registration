import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ResetPasswordFormData } from "@/components/auth/LoginForm";
import { X, AlertCircle, ArrowLeft, Mail, Loader2 } from "lucide-react";

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto px-4 py-8">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md relative">
          <div className="flex items-center justify-between p-6 pb-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 text-base font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </button>

            <button
              onClick={handleCloseClick}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pb-8">
            <div className="text-center mb-8">
              <h4 className="text-3xl font-bold text-gray-900 mb-2">
                Reset Password
              </h4>
              <p className="text-gray-600">
                We&apos;ll send you a reset link to your email.
              </p>
            </div>

            <form className="space-y-6">
              <div className="relative flex items-center">
                <label className="text-[13px] bg-white text-slate-700 font-medium absolute px-2 top-[-10px] left-[18px] z-10">
                  Email
                </label>
                <input
                  {...form.register("email")}
                  type="email"
                  placeholder="Enter email address"
                  className="px-4 py-3.5 pr-8 bg-white text-slate-900 font-medium w-full text-base border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all"
                />
                <Mail className="absolute right-4 w-5 h-5 text-gray-400" strokeWidth={1.8} />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500 ml-1 absolute -bottom-5 left-0">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {dismissibleError && (
                <div
                  className="flex items-center bg-red-50 text-red-700 p-4 rounded-lg border border-red-200"
                  role="alert"
                >
                  <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-base font-medium flex-1">
                    {dismissibleError}
                  </span>
                  <button
                    onClick={dismissError}
                    className="ml-3 flex-shrink-0 hover:bg-red-100 rounded-lg transition-all p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button
                type="button"
                className="w-full py-3.5 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl transition-all"
                onClick={form.handleSubmit(onSubmit)}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-5 w-5 text-white pr-2" />
                    Sending Reset Link...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

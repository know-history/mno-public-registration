import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ResetPasswordFormData } from "@/components/auth/LoginForm";
import { X, AlertCircle, ArrowLeft, Mail, Loader2 } from "lucide-react";

interface ForgotPasswordProps {
  form: UseFormReturn<ResetPasswordFormData>;
  loading: boolean;
  error: string;
  successMessage?: string;
  onSubmit: (data: ResetPasswordFormData) => Promise<void>;
  onBack: () => void;
  onClose?: () => void;
}

export default function ForgotPassword({
  form,
  loading,
  error,
  successMessage,
  onSubmit,
  onBack,
  onClose,
}: ForgotPasswordProps) {
  const [dismissibleError, setDismissibleError] = useState<string>("");
  const [dismissibleSuccess, setDismissibleSuccess] = useState<string>("");

  const watchedFields = form.watch();
  const isValidEmail = watchedFields.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchedFields.email);

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
      }

      setDismissibleError(processedError);
    } else {
      setDismissibleError("");
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      setDismissibleSuccess(successMessage);
    } else {
      setDismissibleSuccess("");
    }
  }, [successMessage]);

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

  const dismissSuccess = () => {
    setDismissibleSuccess("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto px-4 py-8">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md relative">
          <div className="flex items-center justify-between p-6 pb-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 text-base font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </button>

            <button
              onClick={handleCloseClick}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pb-8">
            <div className="text-center mb-8">
              <h4 className="text-3xl font-bold text-gray-900">
                Forgot Your Password?
              </h4>
              <p className="text-gray-600 mt-4">
                Enter your email address and we'll send you a link to reset your password.
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

              {dismissibleSuccess && (
                <div
                  className="flex items-center bg-green-50 text-green-700 p-4 rounded-lg border border-green-200"
                  role="alert"
                >
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base font-medium flex-1">
                    {dismissibleSuccess}
                  </span>
                  <button
                    onClick={dismissSuccess}
                    className="ml-3 flex-shrink-0 hover:bg-green-100 rounded-lg transition-all p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

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
                    className="ml-3 flex-shrink-0 hover:bg-red-100 rounded-lg transition-all p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button
                type="button"
                className={`w-full py-3.5 text-base font-semibold rounded-lg transition-all ${
                  loading || !isValidEmail
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl cursor-pointer"
                }`}
                onClick={form.handleSubmit(onSubmit)}
                disabled={loading || !isValidEmail}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-5 w-5 text-white mr-2" />
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
import React, { useEffect, useState, useRef, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { X, AlertCircle, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";

interface ConfirmForgotPasswordFormData {
  email: string;
  code: string;
  password: string;
  password_confirmation: string;
}

interface ConfirmForgotPasswordProps {
  form: UseFormReturn<ConfirmForgotPasswordFormData>;
  loading: boolean;
  error: string;
  onSubmit: (data: ConfirmForgotPasswordFormData) => Promise<void>;
  onBack: () => void;
  onClose?: () => void;
  onResendCode?: () => Promise<void>;
}

export default function ConfirmForgotPassword({
  form,
  loading,
  error,
  onSubmit,
  onBack,
  onClose,
  onResendCode,
}: ConfirmForgotPasswordProps) {
  const [dismissibleError, setDismissibleError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  
  const [rulesMet, setRulesMet] = useState({
    minLength: false,
    lowercase: false,
    uppercase: false,
    numbers: false,
    specialChars: false,
  });

  const watchedFields = form.watch();
  const passwordsMatch = watchedFields.password === watchedFields.password_confirmation;
  const requiredFieldsFilled = 
    watchedFields.email &&
    watchedFields.code &&
    watchedFields.password &&
    watchedFields.password_confirmation;

  const allRulesMet = Object.values(rulesMet).every(Boolean);
  const canSubmit = passwordsMatch && requiredFieldsFilled && allRulesMet;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCountdown]);

  useEffect(() => {
    const password = watchedFields.password || "";
    setRulesMet({
      minLength: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      specialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    });
  }, [watchedFields.password]);

  const mergedPasswordRef = useCallback(
    (node: HTMLInputElement | null) => {
      const rhfRef = form.register("password", {
        required: "New password is required",
        minLength: {
          value: 8,
          message: "Password must be at least 8 characters",
        },
      }).ref;

      if (typeof rhfRef === "function") rhfRef(node);
      else if (rhfRef)
        (rhfRef as React.MutableRefObject<HTMLInputElement | null>).current = node;

      passwordInputRef.current = node;
    },
    [form]
  );

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

      if (error.includes("CodeMismatchException") || error.includes("Invalid verification code")) {
        processedError = "Invalid confirmation code. Please check your email and try again.";
      } else if (error.includes("ExpiredCodeException")) {
        processedError = "Confirmation code expired. Please request a new one.";
      } else if (error.includes("LimitExceededException")) {
        processedError = "Too many attempts. Please wait before trying again.";
        setIsRateLimited(true);
        setResendCountdown(180);
      } else if (error.includes("UserNotFoundException")) {
        processedError = "User not found.";
      } else if (error.includes("InvalidParameterException")) {
        processedError = "Invalid input.";
      }

      setDismissibleError(processedError);
    } else {
      setDismissibleError("");
      setIsRateLimited(false);
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

  const handleResendCode = async () => {
    if (!onResendCode || resendCountdown > 0 || isRateLimited) return;
    
    if (resendAttempts >= 2) {
      setIsRateLimited(true);
      setResendCountdown(600);
      setDismissibleError("Too many resend attempts. Please wait before trying again.");
      return;
    }
    
    setResendLoading(true);
    try {
      await onResendCode();
      setResendAttempts(prev => prev + 1);
      
      const countdown = resendAttempts === 0 ? 60 : 120;
      setResendCountdown(countdown);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("LimitExceededException")) {
        setIsRateLimited(true);
        setResendCountdown(600);
      }
    } finally {
      setResendLoading(false);
    }
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
              Back to Forgot Password
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
              <h4 className="text-3xl font-bold text-gray-900 mb-2">
                Reset Your Password
              </h4>
              <p className="text-gray-600">
                Enter the confirmation code sent to your email and choose a new password.
              </p>
            </div>

            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="relative flex flex-col">
                <label
                  htmlFor="email"
                  className="text-[13px] bg-white text-slate-700 font-medium absolute px-2 top-[-10px] left-[18px] z-10"
                >
                  Email
                </label>
                <input
                  {...form.register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3.5 bg-gray-50 text-slate-500 font-medium w-full text-base border-2 border-gray-200 rounded-lg outline-none cursor-not-allowed"
                  readOnly
                  disabled
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative flex flex-col">
                <label
                  htmlFor="code"
                  className="text-[13px] bg-white text-slate-700 font-medium absolute px-2 top-[-10px] left-[18px] z-10"
                >
                  Confirmation Code
                </label>
                <input
                  {...form.register("code", {
                    required: "Confirmation code is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "Code must be 6 digits",
                    },
                  })}
                  id="code"
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  className="px-4 py-3.5 bg-white text-slate-900 font-medium w-full text-base border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all"
                />
                {form.formState.errors.code && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.code.message}
                  </p>
                )}
                
                {onResendCode && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">
                      It may take a minute to receive your code. Didn't receive it?{" "}
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={resendCountdown > 0 || resendLoading || isRateLimited}
                        className={`font-medium transition-colors underline ${
                          resendCountdown > 0 || resendLoading || isRateLimited
                            ? "text-gray-400 cursor-not-allowed no-underline"
                            : "text-blue-600 hover:text-blue-800 cursor-pointer"
                        }`}
                      >
                        {resendLoading 
                          ? "Sending new code..." 
                          : isRateLimited
                            ? `Wait ${Math.floor(resendCountdown / 60)}m ${resendCountdown % 60}s to try again`
                            : resendCountdown > 0 
                              ? `Try again in ${resendCountdown}s` 
                              : "Resend a new code"
                        }
                      </button>
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                <h4 className="text-base font-semibold text-gray-800 mb-3">
                  Password Requirements
                </h4>
                <ul className="space-y-2 text-base">
                  {Object.entries(rulesMet).map(([rule, met]) => (
                    <li
                      key={rule}
                      className={`flex items-center ${met ? "text-green-600" : "text-gray-500"}`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full mr-3 ${met ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      {rule === "minLength" && "At least 8 characters"}
                      {rule === "lowercase" && "One lowercase letter"}
                      {rule === "uppercase" && "One uppercase letter"}
                      {rule === "numbers" && "One number"}
                      {rule === "specialChars" && "One special character"}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative flex flex-col">
                <label
                  htmlFor="password"
                  className="text-[13px] bg-white text-slate-700 font-medium absolute px-2 top-[-10px] left-[18px] z-10"
                >
                  New Password
                </label>
                <input
                  {...form.register("password", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  ref={mergedPasswordRef}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="px-4 py-3.5 pr-14 bg-white text-slate-900 font-medium w-full text-base border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                />
                <div className="absolute top-2 bottom-2 right-12 w-[1px] bg-gray-300"></div>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setShowPassword((prev) => !prev);
                    setTimeout(() => passwordInputRef.current?.focus(), 0);
                  }}
                  className="absolute top-0 bottom-0 right-0 m-auto my-auto h-full px-4 flex items-center justify-center rounded hover:bg-blue-50/50 transition cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {form.formState.errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="relative flex flex-col">
                <label
                  htmlFor="password_confirmation"
                  className="text-[13px] bg-white text-slate-700 font-medium absolute px-2 top-[-10px] left-[18px] z-10"
                >
                  Confirm New Password
                </label>
                <input
                  {...form.register("password_confirmation", {
                    required: "Please confirm your new password",
                    validate: (value) =>
                      value === form.getValues("password") ||
                      "Passwords do not match",
                  })}
                  id="password_confirmation"
                  type={showPasswordConfirmation ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="px-4 py-3.5 pr-14 bg-white text-slate-900 font-medium w-full text-base border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                />
                <div className="absolute top-2 bottom-2 right-12 w-[1px] bg-gray-300"></div>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setShowPasswordConfirmation((prev) => !prev);
                  }}
                  className="absolute top-0 bottom-0 right-0 m-auto my-auto h-full px-4 flex items-center justify-center rounded hover:bg-blue-50/50 transition cursor-pointer"
                  aria-label={
                    showPasswordConfirmation ? "Hide password" : "Show password"
                  }
                >
                  {showPasswordConfirmation ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {form.formState.errors.password_confirmation && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.password_confirmation.message}
                  </p>
                )}
              </div>

              {!passwordsMatch && watchedFields.password_confirmation && (
                <div className="text-red-600 text-base ml-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Passwords do not match.
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
                type="submit"
                className={`w-full py-3.5 text-base font-semibold rounded-lg transition-all ${
                  loading || !canSubmit
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl cursor-pointer"
                }`}
                disabled={loading || !canSubmit}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-5 w-5 text-white mr-2" />
                    Resetting Password...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
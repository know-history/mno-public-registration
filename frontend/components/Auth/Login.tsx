import { useEffect, useState, useRef, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { LoginFormData } from "@/components/auth/LoginForm";
import { X, Eye, EyeOff, AlertCircle, Mail, Loader2 } from "lucide-react";

interface LoginProps {
  form: UseFormReturn<LoginFormData>;
  loading: boolean;
  error: string;
  successMessage?: string;
  onSubmit: (data: LoginFormData) => Promise<void>;
  onForgotPassword: () => void;
  onSignUp: () => void;
  onClose: () => void;
}

export default function Login({
  form,
  loading,
  error,
  successMessage,
  onSubmit,
  onForgotPassword,
  onSignUp,
  onClose,
}: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [dismissibleError, setDismissibleError] = useState<string>("");
  const [dismissibleSuccess, setDismissibleSuccess] = useState<string>("");
  const passwordInputRef = useRef<HTMLInputElement>(null);
  
  const watchedFields = form.watch();
  const canSubmit = watchedFields.email && watchedFields.password;

  const mergedPasswordRef = useCallback(
    (node: HTMLInputElement | null) => {
      const rhfRef = form.register("password", {
        required: "Password is required",
      }).ref;

      if (typeof rhfRef === "function") rhfRef(node);
      else if (rhfRef)
        (rhfRef as React.MutableRefObject<HTMLInputElement | null>).current =
          node;

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
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (error) {
      let processedError = error;

      if (
        error.includes("NotAuthorizedException") ||
        error.includes("Incorrect username or password")
      ) {
        processedError = "Incorrect email or password";
      } else if (
        error.includes("UserNotConfirmedException") ||
        error.includes("not confirmed")
      ) {
        processedError =
          "Account not confirmed. Please check your email for confirmation code.";
      } else if (error.includes("UserNotFoundException")) {
        processedError = "User not found";
      } else if (error.includes("TooManyRequestsException")) {
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
          <div className="flex items-center justify-end p-6 pb-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pb-8">
            <div className="text-center mb-8">
              <h4 className="text-3xl font-bold text-gray-900">Welcome Back</h4>
              <p className="text-gray-600 mt-4">
                Please sign in to your account
              </p>
            </div>

            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="relative flex items-center">
                <label className="text-[13px] bg-white text-slate-700 font-medium absolute px-2 top-[-10px] left-[18px] z-10">
                  Email
                </label>
                <input
                  {...form.register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="Enter email address"
                  className="px-4 py-3.5 pr-8 bg-white text-slate-900 font-medium w-full text-base border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all cursor-text"
                />
                <Mail className="absolute right-4 w-5 h-5 text-gray-400" strokeWidth={1.8} />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500 ml-1 absolute -bottom-5 left-0">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative flex items-center">
                <label className="text-[13px] bg-white text-slate-700 font-medium absolute px-2 top-[-10px] left-[18px] z-10">
                  Password
                </label>
                <input
                  {...form.register("password", {
                    required: "Password is required",
                  })}
                  ref={mergedPasswordRef}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="px-4 py-3.5 pr-14 bg-white text-slate-900 font-medium w-full text-base border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all cursor-text"
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
                  <p className="text-xs text-red-500 ml-1 absolute -bottom-5 left-0">
                    {form.formState.errors.password.message}
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
                type="submit"
                disabled={loading || !canSubmit}
                className={`w-full py-3.5 text-base font-semibold rounded-lg transition-all ${
                  loading || !canSubmit
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl cursor-pointer"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white pr-2" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 font-medium text-base transition-colors cursor-pointer"
                  onClick={onForgotPassword}
                >
                  Forgot Your Password?
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-base">
                  <span className="px-4 bg-white text-gray-500">New here?</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3 text-base font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all cursor-pointer"
                onClick={onSignUp}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
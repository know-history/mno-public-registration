import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { LoginFormData } from "@/components/Auth/LoginForm";
import { X, Eye, EyeOff, AlertCircle } from "lucide-react";

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const dismissError = () => {
    setDismissibleError("");
  };

  const dismissSuccess = () => {
    setDismissibleSuccess("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto px-4 py-8">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-md mx-auto mt-12 space-y-6">
        <div className="text-center">
          <h4 className="text-3xl font-bold text-[#333]">Sign In</h4>
          <p className="mt-2 text-base text-[#333]">
            Login to your account to continue.
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-1">
            <input
              {...form.register("email", { required: "Email is required" })}
              type="email"
              placeholder="Enter Email"
              className="px-4 py-3 w-full border border-gray-300 rounded-lg text-[#333] placeholder-gray-500"
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500 ml-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <input
                {...form.register("password", {
                  required: "Password is required",
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="px-4 py-3 w-full border border-gray-300 rounded-lg pr-12 text-[#333] placeholder-gray-500"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-gray-600 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-xs text-red-500 ml-1">
                {form.formState.errors.password.message}
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

          {dismissibleSuccess && (
            <div
              className="flex items-center bg-green-100 text-green-800 p-3 rounded-lg relative"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium flex-1">
                {dismissibleSuccess}
              </span>
              <button
                onClick={dismissSuccess}
                className="ml-3 flex-shrink-0 hover:bg-green-200 rounded-lg transition-all p-1"
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={onForgotPassword}
          >
            Forgot Your Password?
          </button>
        </div>

        <p className="text-center text-[#333]">
          Don't Have an Account?
          <button
            type="button"
            className="ml-1 text-blue-600 hover:underline"
            onClick={onSignUp}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

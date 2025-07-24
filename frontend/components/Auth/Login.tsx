import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { LoginFormData } from "@/components/Auth/LoginForm";
import { X } from "lucide-react";

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
          <h4 className="text-3xl font-bold text-slate-900">MNO Registration</h4>
          <p className="mt-2 text-base text-slate-500">Login to your account to continue</p>
        </div>

        <form className="space-y-4">
          <input
            {...form.register("email", { required: "Email is required" })}
            type="email"
            placeholder="Enter Email"
            className="px-4 py-3 w-full border border-gray-300 rounded-lg"
          />
          {form.formState.errors.email && (
            <p className="text-red-600 text-sm">{form.formState.errors.email.message}</p>
          )}

          <input
            {...form.register("password", { required: "Password is required" })}
            type="password"
            placeholder="Enter Password"
            className="px-4 py-3 w-full border border-gray-300 rounded-lg"
          />
          {form.formState.errors.password && (
            <p className="text-red-600 text-sm">{form.formState.errors.password.message}</p>
          )}
          {error && <div className="text-red-600 text-base">{error}</div>}
          {successMessage && (
            <div className="text-green-600 text-base bg-green-50 p-3 rounded">
              {successMessage}
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
          <a
            href="#"
            className="text-blue-600 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              onForgotPassword();
            }}
          >
            Forgot Your Password?
          </a>
        </div>

        <p className="text-center text-slate-500">
          Don't Have an Account?
          <a
            href="#"
            className="ml-1 text-blue-600 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              onSignUp();
            }}
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

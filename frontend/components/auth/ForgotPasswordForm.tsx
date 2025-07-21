"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/lib/validation";

interface ForgotPasswordFormProps {
  onSuccess?: (email: string) => void;
  onSwitchToLogin?: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const { resetPassword, loading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      clearError();
      await resetPassword(data.email);
      onSuccess?.(data.email);
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email address and we'll send you instructions to reset your
          password
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          {...register("email")}
          type="email"
          label="Email Address"
          error={errors.email?.message}
          autoComplete="email"
          required
        />

        {error && (
          <div
            className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-md"
            role="alert"
          >
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading || isSubmitting}
          className="w-full"
        >
          Send Reset Instructions
        </Button>

        {onSwitchToLogin && (
          <p className="text-center text-sm text-gray-600">
            Remember your password?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Sign In
            </button>
          </p>
        )}
      </form>
    </div>
  );
};

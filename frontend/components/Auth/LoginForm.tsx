"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ForgotPassword from "@/components/auth/ForgotPassword";
import Login from "@/components/auth/Login";
import SignUp from "@/components/auth/SignUp";
import ConfirmSignUp from "./ConfirmSignUp";
import ConfirmForgotPassword from "./ConfirmForgotPassword";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  given_name: z.string().min(1, "First name is required"),
  family_name: z.string().min(1, "Last name is required"),
  date_of_birth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date of birth must be a valid date",
  }),
});

const resetPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

const confirmResetPasswordSchema = z
  .object({
    email: z.email("Invalid email address"),
    code: z.string().length(6, "Code must be 6 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ConfirmForgotPasswordFormData = z.infer<
  typeof confirmResetPasswordSchema
>;

interface LoginFormProps {
  onSuccess?: () => void;
  startWithSignup?: boolean;
  onStateChange?: (state: { needsConfirmation: boolean }) => void;
}

export default function LoginForm({
  onSuccess,
  startWithSignup = false,
  onStateChange,
}: LoginFormProps) {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [needsPasswordReset, setNeedsPasswordReset] = useState(false); // New state for password reset confirmation
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState<string[]>(
    new Array(6).fill("")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSignup, setIsSignup] = useState(startWithSignup);

  useLockBodyScroll(true);

  const safeOnSuccess = () => {
    if (needsConfirmation || needsPasswordReset) {
      return;
    }
    onSuccess?.();
  };

  useEffect(() => {
    setIsSignup(startWithSignup);
  }, [startWithSignup]);

  useEffect(() => {
    onStateChange?.({
      needsConfirmation: needsConfirmation || needsPasswordReset,
    });
  }, [needsConfirmation, needsPasswordReset, onStateChange]);

  const {
    signIn,
    signUp,
    confirmSignUp,
    resetPassword,
    confirmResetPassword,
    resendSignUpCode,
  } = useAuth();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
  });

  const resetPasswordForm = useForm<{ email: string }>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const confirmResetPasswordForm = useForm<ConfirmForgotPasswordFormData>({
    resolver: zodResolver(confirmResetPasswordSchema),
  });

  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await signIn(data.email, data.password);
      safeOnSuccess();
    } catch (err: unknown) {
      const errorText = String((err as Error)?.message || "").toLowerCase();
      const errorStringified = JSON.stringify(err).toLowerCase();
      const errorToString = String(err).toLowerCase();

      const isUnconfirmed =
        errorText.includes("not confirmed") ||
        errorText.includes("usernotconfirmedexception") ||
        errorStringified.includes("not confirmed") ||
        errorStringified.includes("usernotconfirmedexception") ||
        errorToString.includes("not confirmed") ||
        errorToString.includes("usernotconfirmedexception");

      if (isUnconfirmed) {
        setConfirmationEmail(data.email);
        setNeedsConfirmation(true);

        try {
          const { resendSignUpCode } = await import("aws-amplify/auth");
          await resendSignUpCode({ username: data.email });
          setError(
            "Your account is not confirmed. A new confirmation code has been sent to your email."
          );
        } catch {
          setError(
            "Your account is not confirmed. Please enter the confirmation code."
          );
        }

        setTimeout(() => {
          onStateChange?.({ needsConfirmation: true });
        }, 100);

        return;
      } else {
        setError((err as Error)?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (data: ResetPasswordFormData) => {
    setLoading(true);
    setError("");
    try {
      await resetPassword(data.email);
      setConfirmationEmail(data.email);
      setNeedsPasswordReset(true);
      setIsForgotPassword(false);
      confirmResetPasswordForm.setValue("email", data.email);
      setSuccessMessage(
        "If an account with this email exists, you will receive a password reset code shortly."
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      if (errorMessage.includes("LimitExceededException")) {
        setError(
          "Too many reset attempts. Please wait a few minutes before trying again."
        );
      } else {
        setConfirmationEmail(data.email);
        setNeedsPasswordReset(true);
        setIsForgotPassword(false);
        confirmResetPasswordForm.setValue("email", data.email);
        setSuccessMessage(
          "If an account with this email exists, you will receive a password reset code shortly."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmResetPassword = async (
    data: ConfirmForgotPasswordFormData
  ) => {
    setLoading(true);
    setError("");
    try {
      await confirmResetPassword(data.email, data.code, data.password);
      setNeedsPasswordReset(false);
      setError("");
      setIsForgotPassword(false);

      setTimeout(() => {
        setSuccessMessage(
          "Password reset successfully! Please log in with your new password."
        );
      }, 100);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Password reset confirmation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendSignUpCode = async () => {
    if (!confirmationEmail) return;

    try {
      await resendSignUpCode(confirmationEmail);
      setTimeout(() => {
        setError("");
      }, 100);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      if (errorMessage.includes("LimitExceededException")) {
        setError("Too many resend attempts. Please wait before trying again.");
      } else {
      }
    }
  };

  const handleResendPasswordResetCode = async () => {
    if (!confirmationEmail) return;

    try {
      await resetPassword(confirmationEmail);
      setTimeout(() => {
        setError("");
      }, 100);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      if (errorMessage.includes("LimitExceededException")) {
        setError(
          "Too many reset attempts. Please wait a few minutes before trying again."
        );
      } else {
      }
    }
  };

  const handleSignUp = async (data: SignupFormData) => {
    setLoading(true);
    setError("");
    try {
      await signUp(
        data.email,
        data.password,
        data.given_name,
        data.family_name
      );
      setConfirmationEmail(data.email);
      setNeedsConfirmation(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = async () => {
    setLoading(true);
    setError("");
    try {
      const code = confirmationCode.join("");
      await confirmSignUp(confirmationEmail, code);
      setNeedsConfirmation(false);

      setError("");
      setIsSignup(false);
      setIsForgotPassword(false);

      setTimeout(() => {
        setSuccessMessage(
          "Account confirmed successfully! Please log in with your credentials."
        );
      }, 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Confirmation failed");
    } finally {
      setLoading(false);
    }
  };

  const switchToSignup = () => {
    setError("");
    setSuccessMessage("");
    setIsSignup(true);
  };

  const switchToForgotPassword = () => {
    setError("");
    setSuccessMessage("");
    setIsForgotPassword(true);
  };

  const switchBackFromForgotPassword = () => {
    setError("");
    setSuccessMessage("");
    setIsForgotPassword(false);
    setNeedsPasswordReset(false);
  };

  const switchBackFromPasswordReset = () => {
    setError("");
    setSuccessMessage("");
    setNeedsPasswordReset(false);
    setIsForgotPassword(true);
  };

  const switchBackFromSignup = () => {
    setError("");
    setSuccessMessage("");
    setNeedsConfirmation(false);
    setIsSignup(false);
  };

  const handleCloseModal = () => {
    if (needsConfirmation || needsPasswordReset) {
      setError(
        needsConfirmation
          ? 'Please complete the confirmation process or use "Back to Sign Up" to cancel.'
          : 'Please complete the password reset process or use "Back to Forgot Password" to cancel.'
      );
      return;
    }

    setIsForgotPassword(false);
    setError("");
    safeOnSuccess();
  };

  if (needsPasswordReset) {
    return (
      <ConfirmForgotPassword
        form={confirmResetPasswordForm}
        loading={loading}
        error={error}
        onSubmit={handleConfirmResetPassword}
        onBack={switchBackFromPasswordReset}
        onClose={handleCloseModal}
        onResendCode={handleResendPasswordResetCode}
      />
    );
  }

  // Show signup confirmation modal
  if (needsConfirmation) {
    return (
      <ConfirmSignUp
        loading={loading}
        error={error}
        confirmationCode={confirmationCode}
        onChangeCodeAction={setConfirmationCode}
        onSubmitAction={handleConfirmation}
        onBackAction={switchBackFromSignup}
        onClose={handleCloseModal}
        onResendCode={handleResendSignUpCode}
      />
    );
  }

  if (isForgotPassword) {
    return (
      <ForgotPassword
        form={resetPasswordForm}
        loading={loading}
        error={error}
        successMessage={successMessage}
        onSubmit={handleForgotPassword}
        onBack={switchBackFromForgotPassword}
        onClose={handleCloseModal}
      />
    );
  }

  if (isSignup) {
    return (
      <SignUp
        form={signupForm}
        loading={loading}
        error={error}
        onSubmitAction={handleSignUp}
        onBackAction={switchBackFromSignup}
        onClose={handleCloseModal}
      />
    );
  }

  return (
    <Login
      form={loginForm}
      loading={loading}
      error={error}
      successMessage={successMessage}
      onSubmit={handleLogin}
      onForgotPassword={switchToForgotPassword}
      onSignUp={switchToSignup}
      onClose={handleCloseModal}
    />
  );
}

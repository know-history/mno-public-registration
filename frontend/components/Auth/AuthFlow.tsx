import React, { useState } from "react";
import { AuthModal } from "@/components/ui/shared/AuthModal";
import { LoginForm } from "@/components/auth/forms";

export enum AuthFlowStep {
  LOGIN = "login",
  SIGNUP = "signup",
  FORGOT_PASSWORD = "forgotPassword",
  CONFIRM_SIGNUP = "confirmSignup",
  CONFIRM_PASSWORD_RESET = "confirmPasswordReset",
}

interface AuthFlowProps {
  onSuccess?: () => void;
  onClose?: () => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  initialStep?: AuthFlowStep;
}

export function AuthFlow({
  onSuccess,
  onClose,
  onForgotPassword,
  onSignUp,
  initialStep = AuthFlowStep.LOGIN,
}: AuthFlowProps) {
  const [successMessage, setSuccessMessage] = useState("");

  const getModalProps = () => {
    return {
      title: "Welcome back",
      subtitle: "Sign in to your account",
      showBackButton: false,
    };
  };

  const handleLoginSuccess = () => {
    setSuccessMessage("");
    onSuccess?.();
  };

  const content = (
    <LoginForm
      successMessage={successMessage}
      onSuccess={handleLoginSuccess}
      onForgotPassword={onForgotPassword || (() => {})}
      onSignUp={onSignUp || (() => {})}
    />
  );

  if (onClose) {
    return (
      <AuthModal onClose={onClose} {...getModalProps()}>
        {content}
      </AuthModal>
    );
  }

  return (
    <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
      </div>
      {content}
    </div>
  );
}
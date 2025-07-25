import React, { useState } from "react";
import { AuthModal } from "@/components/ui/shared";
import { LoginFlow } from "@/components/auth/flows/LoginFlow";
import { SignupFlow } from "@/components/auth/flows/SignupFlow";
import { PasswordResetFlow } from "@/components/auth/flows/PasswordResetFlow";
import { ConfirmSignupFlow } from "@/components/auth/flows/ConfirmSignupFlow";
import { ConfirmPasswordResetFlow } from "@/components/auth/flows/ConfirmPasswordResetFlow";

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
  initialStep?: AuthFlowStep;
  title?: string;
  subtitle?: string;
}

export function AuthFlow({
  onSuccess,
  onClose,
  initialStep = AuthFlowStep.LOGIN,
  title = "Authentication",
  subtitle,
}: AuthFlowProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLoginSuccess = () => {
    setSuccessMessage("");
    onSuccess?.();
  };

  const handleSignupSuccess = (email: string) => {
    setConfirmationEmail(email);
    setCurrentStep(AuthFlowStep.CONFIRM_SIGNUP);
    setSuccessMessage(
      "Account created! Please check your email for a confirmation code."
    );
  };

  const handlePasswordResetSuccess = (email: string) => {
    setConfirmationEmail(email);
    setCurrentStep(AuthFlowStep.CONFIRM_PASSWORD_RESET);
    setSuccessMessage("Reset code sent! Please check your email.");
  };

  const handleConfirmSignupSuccess = () => {
    setSuccessMessage(
      "Account confirmed successfully! Please log in with your credentials."
    );
    setCurrentStep(AuthFlowStep.LOGIN);
  };

  const handleConfirmPasswordResetSuccess = () => {
    setSuccessMessage(
      "Password reset successfully! Please log in with your new password."
    );
    setCurrentStep(AuthFlowStep.LOGIN);
  };

  const handleSwitchToLogin = () => {
    setSuccessMessage("");
    setCurrentStep(AuthFlowStep.LOGIN);
  };

  const handleSwitchToSignup = () => {
    setSuccessMessage("");
    setCurrentStep(AuthFlowStep.SIGNUP);
  };

  const handleSwitchToForgotPassword = () => {
    setSuccessMessage("");
    setCurrentStep(AuthFlowStep.FORGOT_PASSWORD);
  };

  const handleBackToSignup = () => {
    setSuccessMessage("");
    setCurrentStep(AuthFlowStep.SIGNUP);
  };

  const handleBackToForgotPassword = () => {
    setSuccessMessage("");
    setCurrentStep(AuthFlowStep.FORGOT_PASSWORD);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case AuthFlowStep.LOGIN:
        return (
          <LoginFlow
            onSuccess={handleLoginSuccess}
            onSwitchToSignup={handleSwitchToSignup}
            onSwitchToForgotPassword={handleSwitchToForgotPassword}
            successMessage={successMessage}
          />
        );

      case AuthFlowStep.SIGNUP:
        return (
          <SignupFlow
            onSuccess={handleSignupSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        );

      case AuthFlowStep.FORGOT_PASSWORD:
        return (
          <PasswordResetFlow
            onSuccess={handlePasswordResetSuccess}
            onSwitchToLogin={handleSwitchToLogin}
            successMessage={successMessage}
          />
        );

      case AuthFlowStep.CONFIRM_SIGNUP:
        return (
          <ConfirmSignupFlow
            email={confirmationEmail}
            onSuccess={handleConfirmSignupSuccess}
            onBack={handleBackToSignup}
            successMessage={successMessage}
          />
        );

      case AuthFlowStep.CONFIRM_PASSWORD_RESET:
        return (
          <ConfirmPasswordResetFlow
            email={confirmationEmail}
            onSuccess={handleConfirmPasswordResetSuccess}
            onBack={handleBackToForgotPassword}
            successMessage={successMessage}
          />
        );

      default:
        return (
          <LoginFlow
            onSuccess={handleLoginSuccess}
            onSwitchToSignup={handleSwitchToSignup}
            onSwitchToForgotPassword={handleSwitchToForgotPassword}
          />
        );
    }
  };

  return (
    <AuthModal onClose={onClose} title={title} subtitle={subtitle} size="md">
      {renderCurrentStep()}
    </AuthModal>
  );
}

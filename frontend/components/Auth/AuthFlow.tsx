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
  title,
  subtitle,
}: AuthFlowProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const getStepTitle = (step: AuthFlowStep): string => {
    if (title) return title;
    
    switch (step) {
      case AuthFlowStep.LOGIN:
        return "Welcome back";
      case AuthFlowStep.SIGNUP:
        return "Create account";
      case AuthFlowStep.FORGOT_PASSWORD:
        return "Reset password";
      case AuthFlowStep.CONFIRM_SIGNUP:
        return "Confirm your account";
      case AuthFlowStep.CONFIRM_PASSWORD_RESET:
        return "Confirm password reset";
      default:
        return "Authentication";
    }
  };

  const getStepSubtitle = (step: AuthFlowStep): string => {
    if (subtitle) return subtitle;
    
    switch (step) {
      case AuthFlowStep.LOGIN:
        return "Sign in to your account";
      case AuthFlowStep.SIGNUP:
        return "Join us today";
      case AuthFlowStep.FORGOT_PASSWORD:
        return "Enter your email and we'll send you a reset code";
      case AuthFlowStep.CONFIRM_SIGNUP:
        return "Please check your email for a confirmation code";
      case AuthFlowStep.CONFIRM_PASSWORD_RESET:
        return "Enter the code sent to your email";
      default:
        return "";
    }
  };

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
    <AuthModal 
      onClose={onClose} 
      title={getStepTitle(currentStep)} 
      subtitle={getStepSubtitle(currentStep)} 
      size="md"
      showCloseButton
    >
      {renderCurrentStep()}
    </AuthModal>
  );
}
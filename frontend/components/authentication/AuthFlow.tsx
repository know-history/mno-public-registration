import React, { useState } from "react";
import { AuthModal } from "@/components/ui/shared/AuthModal";
import {
  ForgotPasswordForm,
  ConfirmSignupForm,
  ConfirmPasswordResetForm,
  LoginForm,
  SignupForm,
} from "@/components/authentication/forms";

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
}

export function AuthFlow({
  onSuccess,
  onClose,
  initialStep = AuthFlowStep.LOGIN,
}: AuthFlowProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const getModalProps = () => {
    switch (currentStep) {
      case AuthFlowStep.LOGIN:
        return {
          title: "Welcome back",
          subtitle: "Sign in to your account",
          showBackButton: false,
        };
      case AuthFlowStep.SIGNUP:
        return {
          title: "Create Account",
          subtitle: "Join us today and get started",
          showBackButton: true,
          backButtonText: "Back to Sign In",
          onBack: () => setCurrentStep(AuthFlowStep.LOGIN),
        };
      case AuthFlowStep.FORGOT_PASSWORD:
        return {
          title: "Reset password",
          subtitle: "Enter your email and we'll send you a reset code",
          showBackButton: true,
          backButtonText: "Back to Sign In",
          onBack: () => setCurrentStep(AuthFlowStep.LOGIN),
        };
      case AuthFlowStep.CONFIRM_SIGNUP:
        return {
          title: "Confirm Your Email",
          subtitle: confirmationEmail
            ? `Enter the confirmation code sent to ${confirmationEmail}`
            : "Enter the confirmation code that was sent to your email",
          showBackButton: true,
          backButtonText: "Back to Sign In",
          onBack: () => {
            setCurrentStep(AuthFlowStep.LOGIN);
            setConfirmationEmail("");
          },
        };
      case AuthFlowStep.CONFIRM_PASSWORD_RESET:
        return {
          title: "Reset Your Password",
          subtitle:
            "Enter the confirmation code sent to your email and choose a new password",
          showBackButton: true,
          backButtonText: "Back to Forgot Password",
          onBack: () => setCurrentStep(AuthFlowStep.FORGOT_PASSWORD),
        };
      default:
        return {
          title: "Authentication",
          subtitle: "",
          showBackButton: false,
        };
    }
  };

  const handleLoginSuccess = () => {
    setSuccessMessage("");
    onSuccess?.();
  };

  const handleSignUpSuccess = (email: string) => {
    setConfirmationEmail(email);
    setSuccessMessage("Please check your email for a confirmation code.");
    setCurrentStep(AuthFlowStep.CONFIRM_SIGNUP);
  };

  const handleForgotPasswordSuccess = (email: string) => {
    setConfirmationEmail(email);
    setSuccessMessage("Please check your email for a reset code.");
    setCurrentStep(AuthFlowStep.CONFIRM_PASSWORD_RESET);
  };

  const handleConfirmSignupSuccess = () => {
    setSuccessMessage(
      "Account confirmed successfully! Please log in with your credentials."
    );
    setCurrentStep(AuthFlowStep.LOGIN);
  };

  const handlePasswordResetSuccess = () => {
    setSuccessMessage(
      "Password reset successfully! Please sign in with your new password."
    );
    setCurrentStep(AuthFlowStep.LOGIN);
  };

  // NEW: Handle when login fails due to unconfirmed account
  const handleConfirmationRequired = (email: string) => {
    setConfirmationEmail(email);
    setSuccessMessage(""); // Clear any previous success messages
    setCurrentStep(AuthFlowStep.CONFIRM_SIGNUP);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case AuthFlowStep.LOGIN:
        return (
          <LoginForm
            successMessage={successMessage}
            onSuccess={handleLoginSuccess}
            onForgotPassword={() =>
              setCurrentStep(AuthFlowStep.FORGOT_PASSWORD)
            }
            onSignUp={() => setCurrentStep(AuthFlowStep.SIGNUP)}
            onConfirmationRequired={handleConfirmationRequired}
          />
        );

      case AuthFlowStep.SIGNUP:
        return <SignupForm onSuccess={handleSignUpSuccess} />;

      case AuthFlowStep.FORGOT_PASSWORD:
        return <ForgotPasswordForm onSuccess={handleForgotPasswordSuccess} />;

      case AuthFlowStep.CONFIRM_SIGNUP:
        return (
          <ConfirmSignupForm
            email={confirmationEmail}
            onSuccess={handleConfirmSignupSuccess}
          />
        );

      case AuthFlowStep.CONFIRM_PASSWORD_RESET:
        return (
          <ConfirmPasswordResetForm
            email={confirmationEmail}
            onSuccess={handlePasswordResetSuccess}
          />
        );

      default:
        return null;
    }
  };

  const modalProps = getModalProps();

  return (
    <AuthModal
      title={modalProps.title}
      subtitle={modalProps.subtitle}
      onClose={onClose}
      showBackButton={modalProps.showBackButton}
      backButtonText={modalProps.backButtonText}
      onBack={modalProps.onBack}
    >
      {renderCurrentStep()}
    </AuthModal>
  );
}

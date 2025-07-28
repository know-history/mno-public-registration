import React, { useState, useRef } from "react";
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
}

export function AuthFlow({
  onSuccess,
  onClose,
  initialStep = AuthFlowStep.LOGIN,
}: AuthFlowProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // References to the current step components to access their back handlers
  const confirmSignupRef = useRef<any>(null);
  const confirmPasswordResetRef = useRef<any>(null);

  // Get modal props based on current step
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
          subtitle: "Enter the confirmation code that was sent to your email",
          showBackButton: true,
          backButtonText: "Back to Sign Up",
          // Use the component's back handler with confirmation, fallback to normal navigation
          onBack: () => {
            // For confirmation steps, we want normal back navigation since the component
            // handles its own confirmation logic via the onBack prop
            setCurrentStep(AuthFlowStep.SIGNUP);
          },
        };
      case AuthFlowStep.CONFIRM_PASSWORD_RESET:
        return {
          title: "Reset Your Password",
          subtitle: "Enter the confirmation code sent to your email and choose a new password",
          showBackButton: true,
          backButtonText: "Back to Forgot Password",
          // Use the component's back handler with confirmation, fallback to normal navigation
          onBack: () => {
            // For confirmation steps, we want normal back navigation since the component
            // handles its own confirmation logic via the onBack prop
            setCurrentStep(AuthFlowStep.FORGOT_PASSWORD);
          },
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
            onBack={() => setCurrentStep(AuthFlowStep.SIGNUP)} // Pass the back handler with confirmation logic
            successMessage={successMessage}
          />
        );

      case AuthFlowStep.CONFIRM_PASSWORD_RESET:
        return (
          <ConfirmPasswordResetFlow
            email={confirmationEmail}
            onSuccess={handleConfirmPasswordResetSuccess}
            onBack={() => setCurrentStep(AuthFlowStep.FORGOT_PASSWORD)} // Pass the back handler with confirmation logic
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

  const modalProps = getModalProps();

  return (
    <AuthModal 
      onClose={onClose}
      {...modalProps}
    >
      {renderCurrentStep()}
    </AuthModal>
  );
}
import React from "react";
import { AuthFlow, AuthFlowStep } from "@/components/auth/AuthFlow";

interface AuthModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  startWithSignup?: boolean;
  isInConfirmation?: boolean;
  onStateChange?: (state: { needsConfirmation: boolean }) => void;
}

export const AuthModalWrapper: React.FC<AuthModalWrapperProps> = ({
  isOpen,
  onClose,
  startWithSignup = false,
  isInConfirmation = false,
  onStateChange,
}) => {
  if (!isOpen) return null;

  const initialStep = startWithSignup 
    ? AuthFlowStep.SIGNUP 
    : AuthFlowStep.LOGIN;

  return (
    <AuthFlow
      initialStep={initialStep}
      onSuccess={onClose}
      onClose={onClose}
    />
  );
};
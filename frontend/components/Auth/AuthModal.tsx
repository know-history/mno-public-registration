import React from "react";
import { AuthFlow, AuthFlowStep } from "@/components/auth/AuthFlow";

interface AuthModalProps {
  onSuccess?: () => void;
  startWithSignup?: boolean;
  onStateChange?: (state: { needsConfirmation: boolean }) => void;
}

export default function AuthModal({
  onSuccess,
  startWithSignup = false,
  onStateChange,
}: AuthModalProps) {
  const initialStep = startWithSignup
    ? AuthFlowStep.SIGNUP
    : AuthFlowStep.LOGIN;

  const handleSuccess = () => {
    onStateChange?.({ needsConfirmation: false });
    onSuccess?.();
  };

  const handleStepChange = (step: AuthFlowStep, email?: string) => {
    const confirmationSteps = [
      AuthFlowStep.CONFIRM_SIGNUP,
      AuthFlowStep.CONFIRM_PASSWORD_RESET,
    ];

    const needsConfirmation = confirmationSteps.includes(step);
    onStateChange?.({ needsConfirmation });
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      <div className="p-6">
        <AuthFlow
          initialStep={initialStep}
          onSuccess={handleSuccess}
          onStepChange={handleStepChange}
          useModal={false}
        />
      </div>
    </div>
  );
}

export type {
  LoginFormData,
  SignupFormData,
  ResetPasswordFormData,
  ConfirmForgotPasswordFormData,
} from "@/lib/auth/schemas";

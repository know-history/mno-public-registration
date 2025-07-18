'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ConfirmationForm } from './ConfirmationForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultMode?: 'login' | 'register';
}

type AuthMode = 'login' | 'register' | 'forgot-password' | 'confirmation' | 'reset-password-confirmation';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultMode = 'login',
}) => {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [confirmationEmail, setConfirmationEmail] = useState('');

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  const handleSwitchToRegister = () => setMode('register');
  const handleSwitchToLogin = () => setMode('login');
  const handleSwitchToForgotPassword = () => setMode('forgot-password');
  
  const handleNeedsConfirmation = (email: string) => {
    setConfirmationEmail(email);
    setMode('confirmation');
  };

  const handleForgotPasswordSuccess = (email: string) => {
    setConfirmationEmail(email);
    setMode('reset-password-confirmation');
  };

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Sign In';
      case 'register':
        return 'Create Account';
      case 'forgot-password':
        return 'Reset Password';
      case 'confirmation':
        return 'Confirm Email';
      case 'reset-password-confirmation':
        return 'Check Your Email';
      default:
        return 'Authentication';
    }
  };

  const renderContent = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToRegister={handleSwitchToRegister}
            onSwitchToForgotPassword={handleSwitchToForgotPassword}
          />
        );
      
      case 'register':
        return (
          <RegisterForm
            onSuccess={handleSuccess}
            onSwitchToLogin={handleSwitchToLogin}
            onNeedsConfirmation={handleNeedsConfirmation}
          />
        );
      
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onSuccess={handleForgotPasswordSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        );
      
      case 'confirmation':
        return (
          <ConfirmationForm
            email={confirmationEmail}
            onSuccess={handleSuccess}
            onResendCode={() => {
              // Handle resend logic here
              console.log('Resending confirmation code to:', confirmationEmail);
            }}
          />
        );
      
      case 'reset-password-confirmation':
        return (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Check Your Email
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              We've sent password reset instructions to <strong>{confirmationEmail}</strong>
            </p>
            <button
              onClick={handleSwitchToLogin}
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Back to Sign In
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      size="md"
    >
      {renderContent()}
    </Modal>
  );
};
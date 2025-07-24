'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ForgotPassword from "@/components/Auth/ForgotPassword";
import Login from "@/components/Auth/Login";
import SignUp from "@/components/Auth/SignUp";
import ConfirmSignUp from './ConfirmSignUp';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string().min(8, 'Password must be at least 8 characters'),
  given_name: z.string().min(1, 'First name is required'),
  family_name: z.string().min(1, 'Last name is required'),
  data_of_birth: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: 'Date of birth must be a valid date' }
  ),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  startWithSignup?: boolean;
  onStateChange?: (state: { needsConfirmation: boolean }) => void;
}

export default function LoginForm({ onSuccess, startWithSignup = false, onStateChange }: LoginFormProps) {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState<string[]>(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSignup, setIsSignup] = useState(startWithSignup);

  const safeOnSuccess = () => {
    if (needsConfirmation) {
      return;
    }
    onSuccess?.();
  };

  useEffect(() => {
    setIsSignup(startWithSignup);
  }, [startWithSignup]);

  useEffect(() => {
    onStateChange?.({ needsConfirmation });
  }, [needsConfirmation, onStateChange]);

  const { signIn, signUp, confirmSignUp, resetPassword } = useAuth();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
  });

  const resetPasswordForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const result = await signIn(data.email, data.password);
      safeOnSuccess();
    } catch (err: any) {
      const errorText = String(err?.message || '').toLowerCase();
      const errorStringified = JSON.stringify(err).toLowerCase();
      const errorToString = String(err).toLowerCase();
      
      const isUnconfirmed = 
        errorText.includes('not confirmed') ||
        errorText.includes('usernotconfirmedexception') ||
        errorStringified.includes('not confirmed') ||
        errorStringified.includes('usernotconfirmedexception') ||
        errorToString.includes('not confirmed') ||
        errorToString.includes('usernotconfirmedexception');
      
      if (isUnconfirmed) {
        setConfirmationEmail(data.email);
        setNeedsConfirmation(true);
        
        try {
          const { resendSignUpCode } = await import('aws-amplify/auth');
          await resendSignUpCode({ username: data.email });
          setError('Your account is not confirmed. A new confirmation code has been sent to your email.');
        } catch (resendError) {
          setError('Your account is not confirmed. Please enter the confirmation code.');
        }
        
        setTimeout(() => {
          onStateChange?.({ needsConfirmation: true });
        }, 100);
        
        return;
        
      } else {
        setError(err?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (data: ResetPasswordFormData) => {
    setLoading(true);
    setError('');
    try {
      await resetPassword(data.email);
      safeOnSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Reset Password failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (data: SignupFormData) => {
    setLoading(true);
    setError('');
    try {
      await signUp(data.email, data.password, data.given_name, data.family_name);
      setConfirmationEmail(data.email);
      setNeedsConfirmation(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  const handleConfirmation = async () => {
    setLoading(true);
    setError('');
    try {
      const code = confirmationCode.join('');
      await confirmSignUp(confirmationEmail, code);
      setNeedsConfirmation(false);
      
      setError('');
      setIsSignup(false);
      setIsForgotPassword(false);
      
      setTimeout(() => {
        setSuccessMessage('Account confirmed successfully! Please log in with your credentials.');
      }, 100);
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Confirmation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReopenConfirmation = () => {
    if (confirmationEmail) {
      setNeedsConfirmation(true);
      setError('');
    }
  };

  const switchToSignup = () => {
    setError('');
    setSuccessMessage('');
    setIsSignup(true);
  };

  const switchToLogin = () => {
    setError('');
    setSuccessMessage('');
    setIsSignup(false);
  };

  const switchToForgotPassword = () => {
    setError('');
    setSuccessMessage('');
    setIsForgotPassword(true);
  };

  const switchBackFromForgotPassword = () => {
    setError('');
    setSuccessMessage('');
    setIsForgotPassword(false);
  };

  const switchBackFromSignup = () => {
    setError('');
    setSuccessMessage('');
    setNeedsConfirmation(false);
    setIsSignup(false);
  };

  const handleCloseModal = () => {
    if (needsConfirmation) {
      setError('Please complete the confirmation process or use "Back to Sign Up" to cancel.');
      return;
    }
    
    setIsForgotPassword(false);
    setError('');
    safeOnSuccess();
  };

  return (
    <div
      className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        onClick={handleCloseModal}
      >
        ✕
      </button>

      {needsConfirmation ? (
        <ConfirmSignUp
          loading={loading}
          error={error}
          confirmationCode={confirmationCode}
          onChangeCodeAction={setConfirmationCode}
          onSubmitAction={handleConfirmation}
          onBackAction={switchBackFromSignup}
        />
      ) : isForgotPassword ? (
        <ForgotPassword
          form={resetPasswordForm}
          loading={loading}
          error={error}
          onSubmit={handleForgotPassword}
          onBack={switchBackFromForgotPassword}
        />
      ) : isSignup ? (
        <div>
          <SignUp
            form={signupForm}
            loading={loading}
            error={error}
            onSubmitAction={handleSignUp}
            onBackAction={switchBackFromSignup}
            onClose={handleCloseModal}
          />
          {confirmationEmail && !needsConfirmation && (
            <div className="mt-4 text-center">
              <button
                onClick={handleReopenConfirmation}
                className="text-blue-600 text-sm hover:underline"
              >
                Already have an account? Resend confirmation code
              </button>
            </div>
          )}
        </div>
      ) : (
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
      )}

    </div>
  );
}
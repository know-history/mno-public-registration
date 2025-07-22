'use client';

import React, { useState } from 'react';
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
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState<string[]>(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);

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
    try {
      await signIn(data.email, data.password);
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (data: ResetPasswordFormData) => {
    setLoading(true);
    setError('');
    try {
      await resetPassword(data.email);
      onSuccess?.();
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
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Confirmation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        onClick={() => {
          setIsForgotPassword(false);
          onSuccess?.();
        }}
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
          onBackAction={() => setNeedsConfirmation(false)}
        />
      ) : isForgotPassword ? (
        <ForgotPassword
          form={resetPasswordForm}
          loading={loading}
          error={error}
          onSubmit={handleForgotPassword}
          onBack={() => setIsForgotPassword(false)}
        />
      ) : isSignup ? (
        <SignUp
          form={signupForm}
          loading={loading}
          error={error}
          onSubmitAction={handleSignUp}
          onBackAction={() => setIsSignup(false)}
        />
      ) : (
        <Login
          form={loginForm}
          loading={loading}
          error={error}
          onSubmit={handleLogin}
          onForgotPassword={() => setIsForgotPassword(true)}
          onSignUp={() => setIsSignup(true)}
        />
      )}

    </div>
  );
}
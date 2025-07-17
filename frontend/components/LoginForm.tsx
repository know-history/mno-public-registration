'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  given_name: z.string().min(1, 'First name is required'),
  family_name: z.string().min(1, 'Last name is required'),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const { signIn, signUp, confirmSignUp, resetPassword } = useAuth();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError('');
    try {
      await signIn(data.email, data.password);
      onSuccess?.();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
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
      const errorMessage = err instanceof Error ? err.message : 'Reset Password failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const handleSignup = async (data: SignupFormData) => {
    setLoading(true);
    setError('');
    try {
      await signUp(data.email, data.password, data.given_name, data.family_name);
      setConfirmationEmail(data.email);
      setNeedsConfirmation(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await confirmSignUp(confirmationEmail, confirmationCode);
      setNeedsConfirmation(false);
      setIsSignup(false);
      onSuccess?.();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Confirmation failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (needsConfirmation) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 text-center">
            Confirm Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We sent a confirmation code to {confirmationEmail}
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleConfirmation}>
          <div>
            <input
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              placeholder="Confirmation code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Confirming...' : 'Confirm Email'}
          </button>
        </form>
      </div>
    );
  }

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

      {isForgotPassword ? (
        // 🔐 Forgot Password Form
        <>
          <div className="my-8 text-center">
            <h4 className="text-3xl text-slate-900 font-bold">Reset Password</h4>
            <p className="text-sm text-slate-500 mt-4">
              <strong>Please enter your email address.</strong> <br />
              We will send you instructions on how to reset your password.
            </p>
          </div>

          <form className="space-y-4">
            <div className="relative flex items-center">
              <input
                {...resetPasswordForm.register('email')}
                type="email"
                placeholder="Email address *"
                className="px-4 py-3 bg-white text-slate-900 w-full text-sm border border-gray-300 focus:border-blue-600 outline-none rounded-lg"
              />
            </div>

            <button
              type="button"
              className="px-5 py-2.5 !mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg tracking-wide"
              onClick={resetPasswordForm.handleSubmit(handleForgotPassword)}
            >
              Reset Password
            </button>
          </form>
        </>
      ) : (
        // 🔐 Login Form (existing)
        <>
          <div className="my-8 text-center">
            <h4 className="text-3xl text-slate-900 font-bold">MNO Registration</h4>
            <p className="text-sm text-slate-500 mt-4">Login to your account to continue the process</p>
          </div>

          <form className="space-y-4">
            <div className="relative flex items-center">
              <input
                {...loginForm.register('email')}
                type="email"
                placeholder="Enter Email"
                className="px-4 py-3 bg-white text-slate-900 w-full text-sm border border-gray-300 focus:border-blue-600 outline-none rounded-lg"
              />
            </div>

            <div className="relative flex items-center">
              <input
                type="password"
                placeholder="Enter Password"
                {...loginForm.register('password')}
                className="px-4 py-3 bg-white text-slate-900 w-full text-sm border border-gray-300 focus:border-blue-600 outline-none rounded-lg"
              />
            </div>

            <button
              type="button"
              className="px-5 py-2.5 !mt-10 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg tracking-wide"
              onClick={loginForm.handleSubmit(handleLogin)}
            >
              Sign in
            </button>
          </form>

          <a
            href="#"
            className="text-sm font-medium text-blue-600 text-center mt-4 block hover:underline"
            onClick={(e) => {
              e.preventDefault();
              setIsForgotPassword(true);
            }}
          >
            Forgot Your Password?
          </a>

          <hr className="my-8 border-gray-300" />

          <p className="text-sm text-center text-slate-500">
            Don't Have an Account?
            <a href="#" className="text-sm font-medium text-blue-600 hover:underline ml-1">
              Sign Up
            </a>
          </p>
        </>
      )}
    </div>
  );
}
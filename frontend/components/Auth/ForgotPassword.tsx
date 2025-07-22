import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {ResetPasswordFormData} from "@/components/Auth/LoginForm";

interface ForgotPasswordProps {
  form: UseFormReturn<ResetPasswordFormData>;
  loading: boolean;
  error: string;
  onSubmit: (data: ResetPasswordFormData) => Promise<void>;
  onBack: () => void;
}

export default function ForgotPassword(
  {
    form,
    loading,
    error,
    onSubmit,
    onBack
  }: ForgotPasswordProps) {
  return (
    <>
      <div className="my-8 text-center">
        <h4 className="text-3xl text-slate-900 font-bold">Reset Password</h4>
        <p className="text-sm text-slate-500 mt-4">
          <strong>Please enter your email address.</strong><br />
          We will send you instructions on how to reset your password.
        </p>
      </div>

      <form className="space-y-4">
        <input
          {...form.register('email')}
          type="email"
          placeholder="Email address *"
          className="px-4 py-3 bg-white text-slate-900 w-full text-sm border border-gray-300 focus:border-blue-600 outline-none rounded-lg"
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="button"
          className="px-5 py-2.5 !mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg tracking-wide"
          onClick={form.handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Reset Password'}
        </button>
      </form>

      <button
        type="button"
        onClick={onBack}
        className="mt-4 text-blue-600 text-sm hover:underline block text-center"
      >
        Back to login
      </button>
    </>
  );
}

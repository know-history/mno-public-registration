import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {LoginFormData} from "@/components/Auth/LoginForm";

interface LoginProps {
  form: UseFormReturn<LoginFormData>;
  loading: boolean;
  error: string;
  onSubmit: (data: LoginFormData) => Promise<void>;
  onForgotPassword: () => void;
  onSignUp: () => void;
}

export default function Login(
  {
    form,
    loading,
    error,
    onSubmit,
    onForgotPassword,
    onSignUp
  }: LoginProps) {
  return (
    <>
      <div className="my-8 text-center">
        <h4 className="text-3xl text-slate-900 font-bold">MNO Registration</h4>
        <p className="text-sm text-slate-500 mt-4">Login to your account to continue the process</p>
      </div>

      <form className="space-y-4">
        <input
          {...form.register('email')}
          type="email"
          placeholder="Enter Email"
          className="px-4 py-3 bg-white text-slate-900 w-full text-sm border border-gray-300 focus:border-blue-600 outline-none rounded-lg"
        />
        <input
          {...form.register('password')}
          type="password"
          placeholder="Enter Password"
          className="px-4 py-3 bg-white text-slate-900 w-full text-sm border border-gray-300 focus:border-blue-600 outline-none rounded-lg"
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="button"
          className="px-5 py-2.5 !mt-10 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg tracking-wide"
          onClick={form.handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <a
        href="#"
        className="text-sm font-medium text-blue-600 text-center mt-4 block hover:underline"
        onClick={(e) => {
          e.preventDefault();
          onForgotPassword();
        }}
      >
        Forgot Your Password?
      </a>

      <p className="text-sm text-center text-slate-500">
        Don't Have an Account?
        <a href="#" className="text-sm font-medium text-blue-600 hover:underline ml-1"
           onClick={(e) => { e.preventDefault(); onSignUp(); }}>
          Sign Up
        </a>
      </p>

    </>
  );
}

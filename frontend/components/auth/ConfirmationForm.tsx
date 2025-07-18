'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ConfirmationFormProps {
  email: string;
  onSuccess?: () => void;
  onResendCode?: () => void;
}

export const ConfirmationForm: React.FC<ConfirmationFormProps> = ({
  email,
  onSuccess,
  onResendCode,
}) => {
  const { confirmSignUp, loading, error, clearError } = useAuth();
  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      clearError();
      await confirmSignUp(email, code);
      onSuccess?.();
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Confirm Your Email</h2>
        <p className="mt-2 text-sm text-gray-600">
          We sent a confirmation code to <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="text"
          label="Confirmation Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter 6-digit code"
          maxLength={6}
          required
        />

        {error && (
          <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
          disabled={code.length < 6}
        >
          Confirm Email
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={onResendCode}
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Resend Code
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
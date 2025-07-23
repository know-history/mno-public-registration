'use client';

import React, { useRef } from 'react';

interface ConfirmSignUpProps {
  loading: boolean;
  error: string;
  confirmationCode: string[];
  onChangeCodeAction: (code: string[]) => void;
  onSubmitAction: () => void | Promise<void>;
  onBackAction: () => void;
}

export default function ConfirmSignUp(
  {
    loading,
    error,
    confirmationCode,
    onChangeCodeAction,
    onSubmitAction,
    onBackAction,
  }: ConfirmSignUpProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== 'Backspace' &&
      e.key !== 'Delete' &&
      e.key !== 'Tab' &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    const index = inputRefs.current.findIndex((ref) => ref === e.target);

    if ((e.key === 'Delete' || e.key === 'Backspace') && index >= 0) {
      onChangeCodeAction([
        ...confirmationCode.slice(0, index),
        '',
        ...confirmationCode.slice(index + 1),
      ]);
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const index = inputRefs.current.findIndex((ref) => ref === e.target);
    if (index === -1) return;

    if (value) {
      onChangeCodeAction([
        ...confirmationCode.slice(0, index),
        value,
        ...confirmationCode.slice(index + 1),
      ]);
      if (index < confirmationCode.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    if (!new RegExp(`^[0-9]{${confirmationCode.length}}$`).test(text)) return;
    onChangeCodeAction(text.split(''));
  };

  return (
    <div className="space-y-4">
      <h4 className="text-3xl text-slate-900 font-bold text-center">Confirm Your Email</h4>
      <p className="text-sm text-slate-500 text-center">
        Enter the confirmation code that was sent to your email.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitAction();
        }}
        className="space-y-4"
      >
        <div className="flex justify-center gap-2">
          {confirmationCode.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onPaste={handlePaste}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className="px-4 py-3 w-12 sm:w-14 border border-gray-300 rounded-md text-gray-600 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {error && <div className="text-red-600 text-sm text-center">{error}</div>}

        <button
          type="submit"
          disabled={loading || confirmationCode.some((d) => d === '') || confirmationCode.length !== 6}
          className={`px-5 py-2.5 w-full ${
            loading || confirmationCode.some((d) => d === '')
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white text-sm font-medium rounded-lg`}
        >
          {loading ? 'Confirming...' : 'Confirm'}
        </button>

        <button
          type="button"
          onClick={onBackAction}
          className="text-blue-600 text-sm hover:underline block text-center"
        >
          Back to Sign Up
        </button>
      </form>
    </div>
  );
}

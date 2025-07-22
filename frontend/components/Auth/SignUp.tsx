'use client';

import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { SignupFormData } from './LoginForm'; // adjust path as needed

interface SignUpProps {
  form: UseFormReturn<SignupFormData>;
  loading: boolean;
  error: string;
  onSubmitAction: (data: SignupFormData) => Promise<void>;
  onBackAction: () => void;
}

export default function SignUp(
  {
    form,
    loading,
    error,
    onSubmitAction,
    onBackAction,
  }: SignUpProps) {
  const [rulesMet, setRulesMet] = useState({
    minLength: false,
    lowercase: false,
    uppercase: false,
    numbers: false,
    specialChars: false,
  });
  const levels = ['Empty', 'Weak', 'Medium', 'Strong', 'Very Strong', 'Super Strong'];
  const [levelText, setLevelText] = useState(levels[0]);

  const watchedFields = form.watch();

  const passwordsMatch =
    (watchedFields.password || '') === (watchedFields.password_confirmation || '');

  const requiredFieldsFilled =
    watchedFields.given_name &&
    watchedFields.family_name &&
    watchedFields.email &&
    watchedFields.data_of_birth &&
    watchedFields.password &&
    watchedFields.password_confirmation;

  const canSubmit = passwordsMatch && requiredFieldsFilled;

  useEffect(() => {
    const pwd = watchedFields.password || '';
    const minLength = pwd.length >= 6;
    const lowercase = /[a-z]/.test(pwd);
    const uppercase = /[A-Z]/.test(pwd);
    const numbers = /\d/.test(pwd);
    const specialChars = /[^A-Za-z0-9]/.test(pwd);

    const newRules = { minLength, lowercase, uppercase, numbers, specialChars };
    setRulesMet(newRules);

    const count = Object.values(newRules).filter(Boolean).length;
    setLevelText(levels[Math.min(count, levels.length - 1)]);
  }, [watchedFields.password]);

  const toggleInputType = (id: string) => {
    const el = document.getElementById(id) as HTMLInputElement;
    if (!el) return;
    el.type = el.type === 'password' ? 'text' : 'password';
  };

  return (
    <div className="space-y-4">
      <h4 className="text-3xl text-slate-900 font-bold text-center">Sign Up</h4>
      <p className="text-sm text-slate-500 text-center">
        Fields marked with an <span className="text-red-500">*</span> are required
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          {...form.register('given_name')}
          type="text"
          placeholder="First Name *"
          className="px-4 py-3 w-full border border-gray-300 rounded-md placeholder-gray-600"
        />
        <input
          {...form.register('family_name')}
          type="text"
          placeholder="Last Name *"
          className="px-4 py-3 w-full border border-gray-300 rounded-md placeholder-gray-600"
        />
        <input
          {...form.register('email')}
          type="email"
          placeholder="Email *"
          className="px-4 py-3 w-full border border-gray-300 rounded-md md:col-span-2 text-gray-600"
        />
        <input
          {...form.register('data_of_birth')}
          type="date"
          placeholder="Date of Birth *"
          className="px-4 py-3 w-full border border-gray-300 rounded-md md:col-span-2 text-gray-600"
        />
      </div>

      <div className="mb-3 text-gray-700 dark:text-neutral-200">
        <div>
          <span className="text-sm text-gray-600">Level:</span>{' '}
          <span className="text-sm font-semibold text-gray-600">{levelText}</span>
        </div>

        <h4 className="my-2 text-sm font-semibold text-gray-600">
          Your password must contain:
        </h4>

        <ul className="space-y-1 text-sm text-gray-500 dark:text-neutral-500">
          <li className={`flex items-center gap-x-2 ${rulesMet.minLength ? 'text-teal-500' : ''}`}>
            Minimum number of characters is 6.
          </li>
          <li className={`flex items-center gap-x-2 ${rulesMet.lowercase ? 'text-teal-500' : ''}`}>
            Should contain lowercase.
          </li>
          <li className={`flex items-center gap-x-2 ${rulesMet.uppercase ? 'text-teal-500' : ''}`}>
            Should contain uppercase.
          </li>
          <li className={`flex items-center gap-x-2 ${rulesMet.numbers ? 'text-teal-500' : ''}`}>
            Should contain numbers.
          </li>
          <li
            className={`flex items-center gap-x-2 ${rulesMet.specialChars ? 'text-teal-500' : ''}`}
          >
            Should contain special characters.
          </li>
        </ul>
      </div>

      <div className="relative">
        <input
          type="password"
          id="password-toggle"
          {...form.register('password')}
          placeholder="Password *"
          className="px-4 py-3 w-full border border-gray-300 rounded-md text-gray-600"
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => toggleInputType('password-toggle')}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 cursor-pointer rounded-r-md hover:text-blue-600"
          tabIndex={-1}
          aria-label="Toggle password visibility"
        >
          Show
        </button>
      </div>

      <div className="relative">
        <input
          type="password"
          id="password-confirmation-toggle"
          {...form.register('password_confirmation')}
          placeholder="Password Confirmation *"
          className="px-4 py-3 w-full border border-gray-300 rounded-md text-gray-600"
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => toggleInputType('password-confirmation-toggle')}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 cursor-pointer rounded-r-md hover:text-blue-600"
          tabIndex={-1}
          aria-label="Toggle password confirmation visibility"
        >
          Show
        </button>
      </div>

      {!passwordsMatch && (
        <div className="text-red-600 text-sm">Passwords do not match.</div>
      )}

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        type="button"
        onClick={form.handleSubmit(onSubmitAction)}
        disabled={loading || !canSubmit}
        className={`px-5 py-2.5 w-full ${
          loading || !canSubmit ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        } text-white text-sm font-medium rounded-lg`}
      >
        {loading ? 'Creating account...' : 'Submit'}
      </button>

      <button
        type="button"
        onClick={onBackAction}
        className="mt-2 text-blue-600 text-sm hover:underline block text-center"
      >
        Back to login
      </button>
    </div>
  );
}

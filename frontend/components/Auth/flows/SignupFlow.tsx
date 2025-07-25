import React from "react";
import { FormProvider } from "react-hook-form";
import { Mail, User, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthForm } from "@/hooks/auth";
import { signupSchema } from "@/lib/auth/schemas";
import {
  FormField,
  PasswordField,
  ErrorAlert,
  SubmitButton,
} from "@/components/ui/shared";
import { DatePicker } from "@/components/form/DatePicker";

interface SignupFlowProps {
  onSuccess?: (email: string) => void;
  onSwitchToLogin?: () => void;
}

export function SignupFlow({ onSuccess, onSwitchToLogin }: SignupFlowProps) {
  const { signUp } = useAuth();

  const form = useAuthForm(signupSchema, {
    context: "signup",
    onSuccess: (data) => {
      onSuccess?.(data.email);
    },
  });

  const handleSignup = async (data: {
    email: string;
    password: string;
    password_confirmation: string;
    given_name: string;
    family_name: string;
    date_of_birth: string;
  }) => {
    await signUp(data.email, data.password, data.given_name, data.family_name);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Create account
        </h2>
        <p className="text-gray-600">Join us today</p>
      </div>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleAuthSubmit(handleSignup)}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="given_name"
              label="First Name"
              placeholder="First name"
              icon={<User className="w-5 h-5" />}
              required
              autoComplete="given-name"
            />

            <FormField
              name="family_name"
              label="Last Name"
              placeholder="Last name"
              icon={<User className="w-5 h-5" />}
              required
              autoComplete="family-name"
            />
          </div>

          <FormField
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            icon={<Mail className="w-5 h-5" />}
            required
            autoComplete="email"
          />

          <DatePicker
            name="date_of_birth"
            label="Date of Birth"
            placeholder="Select your date of birth"
            required
          />

          <PasswordField
            name="password"
            label="Password"
            placeholder="Create a password"
            showRequirements={true}
            showStrength={true}
            required
          />

          <PasswordField
            name="password_confirmation"
            label="Confirm Password"
            placeholder="Confirm your password"
            required
          />

          {form.hasError && (
            <ErrorAlert
              message={form.submitError}
              onDismiss={form.dismissError}
            />
          )}

          <SubmitButton
            loading={form.isSubmitting}
            disabled={!form.formState.isValid}
          >
            Create Account
          </SubmitButton>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

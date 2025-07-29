import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  FormField,
  PasswordField,
  SubmitButton,
  ErrorAlert,
} from "@/components/ui/shared";
import { DatePicker } from "@/components/form/DatePicker";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { signupSchema, type SignupFormData } from "@/lib/auth/schemas";
import { processAuthError } from "@/lib/auth/utils/errorHandling";

interface SignupFormProps {
  onSuccess: (email: string) => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dismissibleError, setDismissibleError] = useState("");

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      password_confirmation: "",
      given_name: "",
      family_name: "",
      date_of_birth: "",
    },
  });

  const watchedFields = form.watch();
  const passwordsMatch =
    watchedFields.password === watchedFields.password_confirmation;
  const requiredFieldsFilled =
    watchedFields.given_name &&
    watchedFields.family_name &&
    watchedFields.email &&
    watchedFields.date_of_birth &&
    watchedFields.password &&
    watchedFields.password_confirmation;

  const isUnder16 = watchedFields.date_of_birth
    ? (() => {
        try {
          const birthDate = new Date(watchedFields.date_of_birth);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          const dayDiff = today.getDate() - birthDate.getDate();

          const exactAge =
            age - (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? 1 : 0);

          return exactAge < 16;
        } catch {
          return false;
        }
      })()
    : false;

  const canSubmit = passwordsMatch && requiredFieldsFilled && !isUnder16;

  const handleSubmit = async (data: SignupFormData) => {
    try {
      setLoading(true);
      setDismissibleError("");

      await signUp(
        data.email,
        data.password,
        data.given_name,
        data.family_name,
        data.date_of_birth
      );

      onSuccess(data.email);
    } catch (err: unknown) {
      const processedError = processAuthError(err);
      setDismissibleError(processedError);
    } finally {
      setLoading(false);
    }
  };

  const dismissError = () => setDismissibleError("");

  const dobLabel = (
    <>
      Date of Birth
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="ml-1 flex items-center justify-center w-4 h-4 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            aria-label="More information about Date of Birth"
          >
            <Info className="w-3 h-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3 text-sm text-gray-700">
          We collect your date of birth to customize the application you will be
          submitting. Applicants under 16 years old will require their
          application to be created under an account held by their parent or
          guardian.
        </PopoverContent>
      </Popover>
    </>
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="given_name"
            label="First Name"
            placeholder="Enter your first name"
            icon={<User className="w-5 h-5" />}
            required
            autoComplete="given-name"
          />
          <FormField
            name="family_name"
            label="Last Name"
            placeholder="Enter your last name"
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
          label={dobLabel}
          placeholder="Select your date of birth"
          required
        />

        <PasswordField
          name="password"
          label="Password"
          placeholder="Enter your password"
          required
          showRequirements={true}
        />

        <PasswordField
          name="password_confirmation"
          label="Confirm Password"
          placeholder="Confirm your password"
          required
          showRequirements={false}
        />

        {isUnder16 && (
          <ErrorAlert message="You must be at least 16 years old to create an account. Applicants under 16 years old will require their application to be created under an account held by their parent or guardian." />
        )}

        {!passwordsMatch && watchedFields.password_confirmation && (
          <div className="text-red-600 text-sm ml-1 flex items-center">
            <span className="mr-2">⚠️</span>
            Passwords do not match.
          </div>
        )}

        {dismissibleError && (
          <ErrorAlert message={dismissibleError} onDismiss={dismissError} />
        )}

        <SubmitButton
          loading={loading}
          disabled={!canSubmit}
          text="Create Account"
          loadingText="Creating account..."
        />
      </form>
    </FormProvider>
  );
}

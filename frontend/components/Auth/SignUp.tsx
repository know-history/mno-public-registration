import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { SignupFormData } from "./LoginForm";
import { X } from "lucide-react";

interface SignUpProps {
  form: UseFormReturn<SignupFormData>;
  loading: boolean;
  error: string;
  onSubmitAction: (data: SignupFormData) => Promise<void>;
  onBackAction: () => void;
  onClose: () => void;
}

export default function SignUp({
  form,
  loading,
  error,
  onSubmitAction,
  onBackAction,
  onClose,
}: SignUpProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const [rulesMet, setRulesMet] = useState({
    minLength: false,
    lowercase: false,
    uppercase: false,
    numbers: false,
    specialChars: false,
  });

  const watchedFields = form.watch();
  const passwordsMatch = watchedFields.password === watchedFields.password_confirmation;
  const requiredFieldsFilled =
    watchedFields.given_name &&
    watchedFields.family_name &&
    watchedFields.email &&
    watchedFields.data_of_birth &&
    watchedFields.password &&
    watchedFields.password_confirmation;

  const canSubmit = passwordsMatch && requiredFieldsFilled;

  useEffect(() => {
    const password = watchedFields.password || "";
    setRulesMet({
      minLength: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      specialChars: /[^A-Za-z0-9]/.test(password),
    });
  }, [watchedFields.password]);

  const toggleInputType = (id: string) => {
    const el = document.getElementById(id) as HTMLInputElement;
    if (el) el.type = el.type === "password" ? "text" : "password";
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto px-4 py-8">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-md mx-auto mt-12 space-y-6">
        <form onSubmit={form.handleSubmit(onSubmitAction)} className="space-y-4">
          <h4 className="text-3xl text-center font-bold text-slate-900">Sign Up</h4>
          <p className="text-center text-base text-slate-500">
            Fields marked with <span className="text-red-500">*</span> are required
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...form.register("given_name")} placeholder="First Name *" className="px-4 py-3 w-full border border-gray-300 rounded-md" />
            <input {...form.register("family_name")} placeholder="Last Name *" className="px-4 py-3 w-full border border-gray-300 rounded-md" />
            <input {...form.register("email")} type="email" placeholder="Email *" className="px-4 py-3 w-full border border-gray-300 rounded-md md:col-span-2" />
            <input {...form.register("data_of_birth")} type="date" placeholder="Date of Birth *" className="px-4 py-3 w-full border border-gray-300 rounded-md md:col-span-2" />
          </div>

          <div>
            <h4 className="text-base font-semibold text-gray-600">Your password must contain:</h4>
            <ul className="space-y-1 text-base text-gray-500">
              {Object.entries(rulesMet).map(([rule, met]) => (
                <li key={rule} className={met ? "text-teal-500" : ""}>
                  {rule === "minLength" && "A minimum of 8 characters."}
                  {rule === "lowercase" && "A lowercase character."}
                  {rule === "uppercase" && "An uppercase character."}
                  {rule === "numbers" && "A number."}
                  {rule === "specialChars" && "A special character."}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <input
              type="password"
              id="password-toggle"
              {...form.register("password")}
              placeholder="Password *"
              className="px-4 py-3 w-full border border-gray-300 rounded-md"
              autoComplete="new-password"
            />
            <button type="button" onClick={() => toggleInputType("password-toggle")} className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-blue-600">
              Show
            </button>
          </div>

          <div className="relative">
            <input
              type="password"
              id="password-confirmation-toggle"
              {...form.register("password_confirmation")}
              placeholder="Password Confirmation *"
              className="px-4 py-3 w-full border border-gray-300 rounded-md"
              autoComplete="new-password"
            />
            <button type="button" onClick={() => toggleInputType("password-confirmation-toggle")} className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-blue-600">
              Show
            </button>
          </div>

          {!passwordsMatch && <div className="text-red-600 text-base">Passwords do not match.</div>}
          {error && <div className="text-red-600 text-base">{error}</div>}

          <button
            type="submit"
            disabled={loading || !canSubmit}
            className={`w-full py-2.5 text-white font-medium rounded-lg ${
              loading || !canSubmit ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating account..." : "Submit"}
          </button>

          <button
            type="button"
            onClick={onBackAction}
            className="mt-2 text-blue-600 text-center hover:underline block w-full"
          >
            Back to login
          </button>
        </form>
      </div>
    </div>
  );
}

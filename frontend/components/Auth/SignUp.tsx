import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { SignupFormData } from "./LoginForm";
import { X, Eye, EyeOff, AlertCircle } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [dismissibleError, setDismissibleError] = useState<string>("");

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

  useEffect(() => {
    if (error) {
      let processedError = error;

      if (
        error.includes("UsernameExistsException") ||
        error.includes("User already exists")
      ) {
        processedError = "User already exists";
      } else if (error.includes("InvalidPasswordException")) {
        processedError = "Password does not meet requirements";
      } else if (error.includes("InvalidParameterException")) {
        processedError = "Invalid input provided";
      } else if (error.includes("CodeMismatchException")) {
        processedError = "Invalid confirmation code";
      }

      setDismissibleError(processedError);
    } else {
      setDismissibleError("");
    }
  }, [error]);

  const [rulesMet, setRulesMet] = useState({
    minLength: false,
    lowercase: false,
    uppercase: false,
    numbers: false,
    specialChars: false,
  });

  const watchedFields = form.watch();
  const passwordsMatch =
    watchedFields.password === watchedFields.password_confirmation;
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirmationVisibility = () => {
    setShowPasswordConfirmation(!showPasswordConfirmation);
  };

  const dismissError = () => {
    setDismissibleError("");
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
        <div className="text-center">
          <h4 className="text-3xl font-bold text-[#333]">Sign Up</h4>
          <p className="mt-2 text-base text-[#333]">
            Please enter your details.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmitAction)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <input
                {...form.register("given_name")}
                placeholder="First Name *"
                className="px-4 py-3 w-full border border-gray-300 rounded-lg text-[#333] placeholder-gray-500"
              />
              {form.formState.errors.given_name && (
                <p className="text-xs text-red-500 ml-1">
                  {form.formState.errors.given_name.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <input
                {...form.register("family_name")}
                placeholder="Last Name *"
                className="px-4 py-3 w-full border border-gray-300 rounded-lg text-[#333] placeholder-gray-500"
              />
              {form.formState.errors.family_name && (
                <p className="text-xs text-red-500 ml-1">
                  {form.formState.errors.family_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <input
              {...form.register("email")}
              type="email"
              placeholder="Email *"
              className="px-4 py-3 w-full border border-gray-300 rounded-lg text-[#333] placeholder-gray-500"
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500 ml-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="relative w-full">
              <input
                {...form.register("data_of_birth")}
                type="date"
                placeholder="Date of Birth *"
                className="px-4 py-3 w-full border border-gray-300 rounded-lg text-[#333]"
                style={{
                  colorScheme: "light",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                }}
              />
              <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-[#333]">
                Date of Birth *
              </label>
            </div>
            {form.formState.errors.data_of_birth && (
              <p className="text-xs text-red-500 ml-1">
                {form.formState.errors.data_of_birth.message}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-base font-semibold text-[#333] mb-2">
              Your password must contain:
            </h4>
            <ul className="space-y-1 text-sm text-[#333]">
              {Object.entries(rulesMet).map(([rule, met]) => (
                <li
                  key={rule}
                  className={met ? "text-teal-500" : "text-[#333]"}
                >
                  {rule === "minLength" && "A minimum of 8 characters."}
                  {rule === "lowercase" && "A lowercase character."}
                  {rule === "uppercase" && "An uppercase character."}
                  {rule === "numbers" && "A number."}
                  {rule === "specialChars" && "A special character."}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1">
            <div className="relative">
              <input
                {...form.register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password *"
                className="px-4 py-3 w-full border border-gray-300 rounded-lg pr-12 text-[#333] placeholder-gray-500"
                autoComplete="new-password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-gray-600 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-xs text-red-500 ml-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <input
                {...form.register("password_confirmation")}
                type={showPasswordConfirmation ? "text" : "password"}
                placeholder="Password Confirmation *"
                className="px-4 py-3 w-full border border-gray-300 rounded-lg pr-12 text-[#333] placeholder-gray-500"
                autoComplete="new-password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
              />
              <button
                type="button"
                onClick={togglePasswordConfirmationVisibility}
                className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-gray-600 flex items-center"
              >
                {showPasswordConfirmation ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {form.formState.errors.password_confirmation && (
              <p className="text-xs text-red-500 ml-1">
                {form.formState.errors.password_confirmation.message}
              </p>
            )}
          </div>

          {!passwordsMatch && watchedFields.password_confirmation && (
            <div className="text-red-600 text-sm ml-1">
              Passwords do not match.
            </div>
          )}

          {dismissibleError && (
            <div
              className="flex items-center bg-red-100 text-red-800 p-3 rounded-lg relative"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium flex-1">
                {dismissibleError}
              </span>
              <button
                onClick={dismissError}
                className="ml-3 flex-shrink-0 hover:bg-red-200 rounded-lg transition-all p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !canSubmit}
            className={`w-full py-2.5 text-white font-medium rounded-lg ${
              loading || !canSubmit
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating account..." : "Submit"}
          </button>

          <button
            type="button"
            onClick={onBackAction}
            className="text-blue-600 text-center hover:underline block w-full"
          >
            Back to login
          </button>
        </form>
      </div>
    </div>
  );
}

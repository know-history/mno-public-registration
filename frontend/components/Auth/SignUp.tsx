import { useEffect, useState, useRef, useCallback } from "react";
import { UseFormReturn, FormProvider } from "react-hook-form";
import { SignupFormData } from "./LoginForm";
import {
  X,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Mail,
  Loader2,
  User,
  Info,
} from "lucide-react";
import { DatePicker } from "@/components/form/DatePicker";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

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
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const mergedPasswordRef = useCallback(
    (node: HTMLInputElement | null) => {
      const rhfRef = form.register("password", {
        required: "Password is required",
      }).ref;

      if (typeof rhfRef === "function") rhfRef(node);
      else if (rhfRef)
        (rhfRef as React.MutableRefObject<HTMLInputElement | null>).current =
          node;

      passwordInputRef.current = node;
    },
    [form]
  );

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
    watchedFields.date_of_birth &&
    watchedFields.password &&
    watchedFields.password_confirmation;

  const allRulesMet = Object.values(rulesMet).every(Boolean);
  const canSubmit = passwordsMatch && requiredFieldsFilled && allRulesMet;

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
    const password = watchedFields.password || "";
    setRulesMet({
      minLength: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      specialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    });
  }, [watchedFields.password]);

  useEffect(() => {
    if (error) {
      setDismissibleError(error);
    } else {
      setDismissibleError("");
    }
  }, [error]);

  const dismissError = () => {
    setDismissibleError("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto px-4 py-8">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md relative">
          <div className="flex items-center justify-between p-6 pb-4">
            <button
              onClick={onBackAction}
              className="flex items-center text-gray-600 hover:text-gray-800 text-base font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </button>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pb-8">
            <div className="text-center mb-8">
              <h4 className="text-3xl font-bold text-gray-900">Create Account</h4>
              <p className="text-gray-600 mt-4">
                Join us today and get started
              </p>
            </div>

            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitAction)}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative flex items-center">
                    <label className="text-[13px] bg-white text-slate-700 font-medium absolute px-2 top-[-10px] left-[18px] z-10">
                      First Name
                    </label>
                    <input
                      {...form.register("given_name")}
                      type="text"
                      placeholder="Enter first name"
                      className="px-4 py-3.5 pr-8 bg-white text-slate-900 font-medium w-full text-base border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all cursor-text"
                    />
                    <User className="absolute right-4 w-[18px] h-[18px] text-gray-400" />
                    {form.formState.errors.given_name && (
                      <p className="text-xs text-red-500 ml-1 absolute -bottom-5 left-0">
                        {form.formState.errors.given_name.message}
                      </p>
                    )}
                  </div>

                  <div className="relative flex items-center">
                    <label className="text-[13px] bg-white text-slate-700 font-medium absolute px-2 top-[-10px] left-[18px] z-10">
                      Last Name
                    </label>
                    <input
                      {...form.register("family_name")}
                      type="text"
                      placeholder="Enter last name"
                      className="px-4 py-3.5 pr-8 bg-white text-slate-900 font-medium w-full text-base border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all cursor-text"
                    />
                    <User className="absolute right-4 w-[18px] h-[18px] text-gray-400" />
                    {form.formState.errors.family_name && (
                      <p className="text-xs text-red-500 ml-1 absolute -bottom-5 left-0">
                        {form.formState.errors.family_name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative flex items-center">
                  <label className="text-[13px] bg-white text-slate-700 font-medium absolute px-2 top-[-10px] left-[18px] z-10">
                    Email
                  </label>
                  <input
                    {...form.register("email")}
                    type="email"
                    placeholder="Enter email"
                    className="px-4 py-3.5 pr-8 bg-white text-slate-900 font-medium w-full text-base border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all cursor-text"
                  />
                  <Mail className="absolute right-4 w-[18px] h-[18px] text-gray-400" />
                  {form.formState.errors.email && (
                    <p className="text-xs text-red-500 ml-1 absolute -bottom-5 left-0">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="relative flex flex-col w-full">
                  <style jsx>{`
                    input[type="date"] {
                      cursor: pointer;
                    }
                    input[type="date"]::-webkit-calendar-picker-indicator {
                      cursor: pointer;
                    }
                  `}</style>
                  <DatePicker
                    name="date_of_birth"
                    label={dobLabel}
                    placeholder="Enter date of birth"
                  />
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                  <h4 className="text-base font-semibold text-gray-800 mb-3">
                    Password Requirements
                  </h4>
                  <ul className="space-y-2 text-base">
                    {Object.entries(rulesMet).map(([rule, met]) => (
                      <li
                        key={rule}
                        className={`flex items-center ${met ? "text-green-600" : "text-gray-500"}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-3 ${met ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                        {rule === "minLength" && "At least 8 characters"}
                        {rule === "lowercase" && "One lowercase letter"}
                        {rule === "uppercase" && "One uppercase letter"}
                        {rule === "numbers" && "One number"}
                        {rule === "specialChars" && "One special character"}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative flex items-center">
                  <label className="text-[13px] bg-white text-slate-700 font-medium absolute px-2 top-[-10px] left-[18px] z-10">
                    Password
                  </label>
                  <input
                    {...form.register("password", {
                      required: "Password is required",
                    })}
                    ref={mergedPasswordRef}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="px-4 py-3.5 pr-14 bg-white text-slate-900 font-medium w-full text-base border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all cursor-text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                  <div className="absolute top-2 bottom-2 right-12 w-[1px] bg-gray-300"></div>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShowPassword((prev) => !prev);
                      setTimeout(() => passwordInputRef.current?.focus(), 0);
                    }}
                    className="absolute top-0 bottom-0 right-0 m-auto my-auto h-full px-4 flex items-center justify-center rounded hover:bg-blue-50/50 transition cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {form.formState.errors.password && (
                    <p className="text-xs text-red-500 ml-1 absolute -bottom-5 left-0">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="relative flex items-center">
                  <label className="text-[13px] bg-white text-slate-700 font-medium absolute px-2 top-[-10px] left-[18px] z-10">
                    Confirm Password
                  </label>
                  <input
                    {...form.register("password_confirmation", {
                      required: "Please confirm your password",
                    })}
                    type={showPasswordConfirmation ? "text" : "password"}
                    placeholder="Confirm password"
                    className="px-4 py-3.5 pr-14 bg-white text-slate-900 font-medium w-full text-base border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all cursor-text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                  <div className="absolute top-2 bottom-2 right-12 w-[1px] bg-gray-300"></div>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowPasswordConfirmation((prev) => !prev)}
                    className="absolute top-0 bottom-0 right-0 m-auto my-auto h-full px-4 flex items-center justify-center rounded hover:bg-blue-50/50 transition cursor-pointer"
                    aria-label={
                      showPasswordConfirmation
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPasswordConfirmation ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {form.formState.errors.password_confirmation && (
                    <p className="text-xs text-red-500 ml-1 absolute -bottom-5 left-0">
                      {form.formState.errors.password_confirmation.message}
                    </p>
                  )}
                </div>

                {!passwordsMatch && watchedFields.password_confirmation && (
                  <div className="text-red-600 text-base ml-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Passwords do not match.
                  </div>
                )}

                {dismissibleError && (
                  <div
                    className="flex items-center bg-red-50 text-red-700 p-4 rounded-lg border border-red-200"
                    role="alert"
                  >
                    <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="text-base font-medium flex-1">
                      {dismissibleError}
                    </span>
                    <button
                      onClick={dismissError}
                      className="ml-3 flex-shrink-0 hover:bg-red-100 rounded-lg transition-all p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !canSubmit}
                  className={`w-full py-3.5 text-base font-semibold rounded-lg transition-all ${
                    loading || !canSubmit
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl cursor-pointer"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white pr-2" />
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
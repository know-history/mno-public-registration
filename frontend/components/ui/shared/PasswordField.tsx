import React, { useState, useRef, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePasswordValidation } from "@/hooks/auth/usePasswordValidation";

interface PasswordFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  showToggle?: boolean;
  showStrength?: boolean;
  showRequirements?: boolean;
  className?: string;
}

export function PasswordField({
  name,
  label,
  placeholder = "Enter your password",
  disabled = false,
  required = false,
  showToggle = true,
  showStrength = false,
  showRequirements = false,
  className,
}: PasswordFieldProps) {
  const { register, formState, watch } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const error = formState.errors[name]?.message as string | undefined;
  const passwordValue = watch(name) || "";

  const { requirements, strength, isValid } =
    usePasswordValidation(passwordValue);

  const mergedPasswordRef = useCallback(
    (node: HTMLInputElement | null) => {
      const rhfRef = register(name, {
        required: required ? `${label} is required` : false,
      }).ref;

      if (typeof rhfRef === "function") rhfRef(node);
      else if (rhfRef)
        (rhfRef as React.MutableRefObject<HTMLInputElement | null>).current =
          node;

      passwordInputRef.current = node;
    },
    [register, name, required, label]
  );

  // Enhanced iOS focus preservation
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
    
    // Enhanced focus preservation for mobile/iOS
    const currentFocus = passwordInputRef.current;
    if (currentFocus) {
      // Store current selection
      const start = currentFocus.selectionStart;
      const end = currentFocus.selectionEnd;
      
      // Use multiple methods to ensure focus is maintained
      setTimeout(() => {
        if (currentFocus) {
          currentFocus.focus();
          // Restore selection if it existed
          if (start !== null && end !== null) {
            currentFocus.setSelectionRange(start, end);
          }
        }
      }, 0);
      
      // Additional timeout for iOS Safari
      setTimeout(() => {
        if (currentFocus && document.activeElement !== currentFocus) {
          currentFocus.focus();
        }
      }, 10);
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return "text-green-600";
    if (strength >= 60) return "text-yellow-600";
    if (strength >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getStrengthBarColor = (strength: number) => {
    if (strength >= 80) return "bg-green-500";
    if (strength >= 60) return "bg-yellow-500";
    if (strength >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getStrengthLabel = (strength: number) => {
    if (strength >= 80) return "Strong";
    if (strength >= 60) return "Good";
    if (strength >= 40) return "Fair";
    return "Weak";
  };

  return (
    <div className={cn("space-y-4", className)}>
      {showRequirements && passwordValue && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
          <h4 className="text-base font-semibold text-gray-800 mb-3">
            Password Requirements
          </h4>
          <ul className="space-y-2 text-sm">
            {requirements.map((requirement) => (
              <li
                key={requirement.key}
                className={cn(
                  "flex items-center",
                  requirement.met
                    ? "text-green-600"
                    : "text-gray-500"
                )}
              >
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full mr-3",
                    requirement.met ? "bg-green-500" : "bg-gray-300"
                  )}
                />
                {requirement.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="relative flex flex-col">
        <label
          htmlFor={name}
          className="text-[13px] bg-white text-slate-700 font-medium absolute px-2 top-[-10px] left-[18px] z-10"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="relative flex items-center">
          <input
            {...register(name)}
            ref={mergedPasswordRef}
            id={name}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full text-base border-2 border-gray-200 rounded-lg outline-none transition-all",
              "px-4 py-3.5 bg-white text-slate-900 font-medium",
              "hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
              showToggle && "pr-12",
              disabled &&
                "bg-gray-100 text-slate-500 cursor-not-allowed border-gray-200",
              error && "border-red-300 focus:border-red-500 focus:ring-red-100"
            )}
          />

          {showToggle && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={disabled}
              className={cn(
                "absolute right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded",
                disabled && "cursor-not-allowed opacity-50"
              )}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 mt-1 px-1">
            {error}
          </p>
        )}
      </div>

      {showStrength && passwordValue && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Password strength
            </span>
            <span className={cn("text-sm font-medium", getStrengthColor(strength))}>
              {getStrengthLabel(strength)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                getStrengthBarColor(strength)
              )}
              style={{ width: `${strength}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
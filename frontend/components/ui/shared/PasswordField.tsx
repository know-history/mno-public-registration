import React, { useState, useRef, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { PasswordFieldProps } from "@/lib/auth/types/form.types";
import { updatePasswordRequirements } from "@/lib/auth/utils/passwordValidation";

export function PasswordField({
  name,
  label,
  placeholder,
  disabled = false,
  required = false,
  showToggle = true,
  strength = false,
  className,
}: PasswordFieldProps) {
  const { register, formState, watch } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const error = formState.errors[name]?.message as string | undefined;
  const passwordValue = watch(name) || "";

  const mergedPasswordRef = useCallback(
    (node: HTMLInputElement | null) => {
      const rhfRef = register(name).ref;

      if (typeof rhfRef === "function") rhfRef(node);
      else if (rhfRef)
        (rhfRef as React.MutableRefObject<HTMLInputElement | null>).current =
          node;

      passwordInputRef.current = node;
    },
    [register, name]
  );

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
    setTimeout(() => passwordInputRef.current?.focus(), 0);
  };

  const passwordRequirements = strength
    ? updatePasswordRequirements(passwordValue)
    : [];

  return (
    <div className={cn("space-y-4", className)}>
      {strength && passwordRequirements.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
          <h4 className="text-base font-semibold text-gray-800 mb-3">
            Password Requirements
          </h4>
          <ul className="space-y-2 text-base">
            {passwordRequirements.map((requirement) => (
              <li
                key={requirement.key}
                className={cn(
                  "flex items-center",
                  requirement.met ? "text-green-600" : "text-gray-500"
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
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            className={cn(
              "px-4 py-3.5 bg-white text-slate-900 font-medium w-full text-base border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all",
              showToggle ? "pr-14" : "pr-4",
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "",
              disabled
                ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                : "cursor-text"
            )}
          />

          {showToggle && (
            <>
              <div className="absolute top-2 bottom-2 right-12 w-[1px] bg-gray-300" />
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  togglePasswordVisibility();
                }}
                disabled={disabled}
                className={cn(
                  "absolute top-0 bottom-0 right-0 m-auto my-auto h-full px-4 flex items-center justify-center rounded hover:bg-blue-50/50 transition",
                  disabled ? "cursor-not-allowed" : "cursor-pointer"
                )}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </>
          )}
        </div>

        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
}

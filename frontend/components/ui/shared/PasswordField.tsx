import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { PasswordRequirements } from "@/components/ui/shared/PasswordRequirements";

interface PasswordFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  showToggle?: boolean;
  showRequirements?: boolean;
  className?: string;
}

export function PasswordField({
  name,
  label,
  placeholder = "Enter password",
  disabled = false,
  required = false,
  showToggle = true,
  showRequirements = false,
  className,
}: PasswordFieldProps) {
  const { register, formState, watch } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const error = formState.errors[name]?.message as string | undefined;
  const passwordValue = watch(name) || "";

  return (
    <div className={cn("relative flex flex-col", className)}>
      <label
        htmlFor={name}
        className="text-[13px] bg-white text-slate-700 font-medium absolute px-2 top-[-10px] left-[18px] z-10 cursor-pointer"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative flex items-center">
        <input
          {...register(name, {
            required: required ? `${label} is required` : false,
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          id={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete="new-password"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
          disabled={disabled}
          className={cn(
            "px-4 py-3.5 bg-white text-slate-900 font-medium w-full text-base border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all",
            showToggle && "pr-14",
            disabled && "bg-gray-100 text-slate-500 cursor-not-allowed border-gray-200",
            error && "border-red-300 focus:border-red-500 focus:ring-red-100",
            "cursor-text"
          )}
        />
        
        {showToggle && (
          <>
            <div className="absolute top-2 bottom-2 right-12 w-[1px] bg-gray-300"></div>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowPassword((prev) => !prev);
              }}
              className="absolute top-0 bottom-0 right-0 m-auto my-auto h-full px-4 flex items-center justify-center rounded hover:bg-blue-50/50 transition cursor-pointer"
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

      {error && (
        <p className="text-xs text-red-500 mt-1 px-1">
          {error}
        </p>
      )}

      {showRequirements && (
        <div className="mt-4">
          <PasswordRequirements 
            password={passwordValue}
            variant="dynamic"
            showProgress={true}
          />
        </div>
      )}
    </div>
  );
}
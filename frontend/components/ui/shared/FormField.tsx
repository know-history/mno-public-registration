import React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}

export function FormField({
  name,
  type = "text",
  label,
  placeholder,
  icon,
  disabled = false,
  required = false,
  autoComplete,
  className,
}: FormFieldProps) {
  const { register, formState } = useFormContext();
  const error = formState.errors[name]?.message as string | undefined;

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
          })}
          id={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={cn(
            "px-4 py-3.5 bg-white text-slate-900 font-medium w-full text-base border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all",
            icon && "pr-12",
            disabled && "bg-gray-100 text-slate-500 cursor-not-allowed border-gray-200",
            error && "border-red-300 focus:border-red-500 focus:ring-red-100",
            "cursor-text"
          )}
        />
        
        {icon && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1 px-1">
          {error}
        </p>
      )}
    </div>
  );
}
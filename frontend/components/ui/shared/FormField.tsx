import React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormFieldProps } from "@/lib/auth/types/form.types";

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
  inputClassName,
  ...props
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
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
            {icon}
          </div>
        )}
        
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
            "w-full text-base border-2 border-gray-200 rounded-lg outline-none transition-all",
            "px-4 py-3.5 bg-white text-slate-900 font-medium cursor-text",
            "hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            icon && "pl-12",
            disabled && "bg-gray-100 text-slate-500 cursor-not-allowed border-gray-200",
            error && "border-red-300 focus:border-red-500 focus:ring-red-100",
            inputClassName
          )}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1 px-1">
          {error}
        </p>
      )}
    </div>
  );
}
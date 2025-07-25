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
  className,
}: FormFieldProps) {
  const { register, formState } = useFormContext();
  const error = formState.errors[name]?.message as string | undefined;

  return (
    <div className={cn("relative flex flex-col", className)}>
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
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "px-4 py-3.5 bg-white text-slate-900 font-medium w-full text-base border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all",
            icon ? "pr-10" : "",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
              : "",
            disabled
              ? "bg-gray-50 text-gray-500 cursor-not-allowed"
              : "cursor-text"
          )}
        />

        {icon && (
          <div className="absolute right-4 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

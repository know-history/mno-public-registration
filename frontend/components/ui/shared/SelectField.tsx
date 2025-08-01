import React from "react";
import { useFormContext } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  valueAsNumber?: boolean;
  setValueAs?: (value: string | number) => string | number | undefined;
}

export function SelectField({
  name,
  label,
  options,
  placeholder = "Select an option",
  required = false,
  disabled = false,
  className,
  valueAsNumber = false,
  setValueAs,
}: SelectFieldProps) {
  const { register, formState, watch } = useFormContext();
  const error = formState.errors[name]?.message as string | undefined;
  const currentValue = watch(name);

  return (
    <div className={cn("relative flex flex-col", className)}>
      <label
        htmlFor={name}
        className="text-[13px] bg-white text-slate-700 font-medium absolute px-2 top-[-10px] left-[18px] z-10 cursor-pointer"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <select
          {...register(name, {
            required: required ? `${label} is required` : false,
            ...(valueAsNumber ? { valueAsNumber: true } : {}),
            ...(setValueAs ? { setValueAs } : {}),
          })}
          id={name}
          disabled={disabled}
          className={cn(
            "px-4 py-3.5 pr-12 bg-white text-slate-900 font-medium w-full text-base border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all appearance-none cursor-pointer",
            error && "border-red-300 focus:border-red-500 focus:ring-red-100",
            disabled &&
              "bg-gray-100 text-slate-500 cursor-not-allowed border-gray-200",
            !currentValue && "text-gray-500"
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mt-1 px-1">{error}</p>}
    </div>
  );
}

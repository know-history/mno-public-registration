"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useFormContext, Controller } from "react-hook-form";

interface DatePickerProps {
  name: string;
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  name,
  label = "Select date",
  placeholder = "Pick a date",
  disabled = false,
  required = false,
}) => {
  const { control, formState } = useFormContext();
  const error = formState.errors[name]?.message as string | undefined;
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative w-full">
      {label && (
        <label 
          htmlFor={name}
          className="flex items-center space-x-1 text-[13px] bg-white text-slate-700 font-medium absolute px-2 top-[-10px] left-[18px] z-10 cursor-pointer"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        rules={{
          required: required ? "Date of birth is required" : false,
        }}
        render={({ field }) => {
          const parseLocalDate = (dateString: string) => {
            const [year, month, day] = dateString.split("-").map(Number);
            return new Date(year, month - 1, day);
          };

          const selectedDate = field.value
            ? parseLocalDate(field.value)
            : undefined;

          return (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  disabled={disabled}
                  className={cn(
                    "px-4 py-3.5 pr-12 bg-white text-slate-900 font-medium w-full text-base border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all text-left cursor-pointer",
                    !field.value && "text-gray-500",
                    disabled 
                      ? "opacity-50 cursor-not-allowed" 
                      : "cursor-pointer",
                    error && "border-red-300 focus:border-red-500 focus:ring-red-100"
                  )}
                >
                  {field.value
                    ? format(selectedDate!, "MMMM do, yyyy")
                    : <span className="text-gray-500">{placeholder}</span>}
                  <CalendarIcon className="ml-auto h-5 w-5 opacity-65 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  defaultMonth={selectedDate || new Date()}
                  onSelect={(date) => {
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, "0");
                      const day = String(date.getDate()).padStart(2, "0");
                      field.onChange(`${year}-${month}-${day}`);
                      setIsOpen(false);
                    } else {
                      field.onChange("");
                    }
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  autoFocus
                  captionLayout="dropdown"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          );
        }}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1 px-1">
          {error}
        </p>
      )}
    </div>
  );
};
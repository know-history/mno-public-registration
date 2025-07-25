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
}

export const DatePicker: React.FC<DatePickerProps> = ({
  name,
  label = "Select date",
  placeholder = "Pick a date",
  disabled = false,
}) => {
  const { control, formState } = useFormContext();
  const error = formState.errors[name]?.message as string | undefined;

  return (
    <div className="relative w-full">
      {label && (
        <label className="flex items-center space-x-1 text-[13px] bg-white text-slate-700 font-medium absolute px-2 top-[-10px] left-[18px] z-10">
          {label}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const parseLocalDate = (dateString: string) => {
            const [year, month, day] = dateString.split("-").map(Number);
            return new Date(year, month - 1, day);
          };

          const selectedDate = field.value
            ? parseLocalDate(field.value)
            : undefined;

          return (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  disabled={disabled}
                  className={cn(
                    "w-full text-left px-4 py-3.5 pr-10 bg-white text-slate-900 font-medium text-base border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all",
                    !field.value && "text-muted-foreground",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {field.value
                    ? format(parseLocalDate(field.value), "PPP")
                    : placeholder}
                  <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  defaultMonth={selectedDate}
                  onSelect={(date) => {
                    if (!date) return field.onChange("");
                    field.onChange(formatDateToLocalISO(date));
                  }}
                  disabled={(date) => date > new Date()}
                  autoFocus
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          );
        }}
      />
      {error && (
        <p className="text-xs text-red-500 ml-1 mt-1 absolute -bottom-5 left-0">
          {error}
        </p>
      )}
    </div>
  );
};

function formatDateToLocalISO(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

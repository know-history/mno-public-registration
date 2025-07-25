import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CONFIRMATION } from "@/lib/auth/constants";

interface CodeInputProps {
  value: string[];
  onChange: (code: string[]) => void;
  length?: number;
  disabled?: boolean;
  className?: string;
}

export function CodeInput({
  value,
  onChange,
  length = CONFIRMATION.CODE_LENGTH,
  disabled = false,
  className,
}: CodeInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const index = inputRefs.current.findIndex((ref) => ref === e.target);

    if (index === -1) return;

    if (inputValue) {
      const newCode = [...value];
      newCode[index] = inputValue;
      onChange(newCode);

      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const index = inputRefs.current.findIndex((ref) => ref === e.target);

    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
      return;
    }

    if ((e.key === "Delete" || e.key === "Backspace") && index >= 0) {
      const newCode = [...value];
      newCode[index] = "";
      onChange(newCode);

      if (e.key === "Backspace" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");

    if (!new RegExp(`^[0-9]{${length}}$`).test(text)) return;

    onChange(text.split(""));
  };

  return (
    <div className={cn("flex justify-center gap-2 px-2", className)}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={value[index] || ""}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onPaste={handlePaste}
          disabled={disabled}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          className={cn(
            "w-12 h-12 border border-gray-300 rounded-lg text-gray-900 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all",
            disabled && "bg-gray-50 cursor-not-allowed"
          )}
        />
      ))}
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CodeInputProps {
  value: string;
  onChange: (code: string) => void;
  onComplete?: (code: string) => void;
  length?: number;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function CodeInput({
  value,
  onChange,
  onComplete,
  length = 6,
  disabled = false,
  error = false,
  className,
}: CodeInputProps) {
  const [codes, setCodes] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const newCodes = value
      .split("")
      .concat(Array(length).fill(""))
      .slice(0, length);
    setCodes(newCodes);
  }, [value, length]);

  const handleChange = (index: number, newValue: string) => {
    if (newValue.length > 1) {
      newValue = newValue.slice(-1);
    }

    if (!/^\d*$/.test(newValue)) {
      return;
    }

    const newCodes = [...codes];
    newCodes[index] = newValue;
    setCodes(newCodes);

    const fullCode = newCodes.join("");
    onChange(fullCode);

    if (fullCode.length === length && onComplete) {
      setTimeout(() => {
        onComplete(fullCode);
      }, 100);
    }

    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (!codes[index] && index > 0) {
        const newCodes = [...codes];
        newCodes[index - 1] = "";
        setCodes(newCodes);
        onChange(newCodes.join(""));
        inputRefs.current[index - 1]?.focus();
      } else if (codes[index]) {
        const newCodes = [...codes];
        newCodes[index] = "";
        setCodes(newCodes);
        onChange(newCodes.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (pastedText) {
      const newCodes = pastedText
        .split("")
        .concat(Array(length).fill(""))
        .slice(0, length);
      setCodes(newCodes);
      onChange(pastedText);

      const nextEmptyIndex = newCodes.findIndex((code) => !code);
      const targetIndex =
        nextEmptyIndex === -1
          ? length - 1
          : Math.min(nextEmptyIndex, length - 1);
      inputRefs.current[targetIndex]?.focus();
    }
  };

  return (
    <div className={cn("flex gap-3 justify-center", className)}>
      {codes.map((code, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          value={code}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg outline-none transition-all",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            disabled && "bg-gray-100 text-gray-500 cursor-not-allowed",
            code && !error && "border-blue-300 bg-blue-50"
          )}
          maxLength={1}
          autoComplete="off"
        />
      ))}
    </div>
  );
}

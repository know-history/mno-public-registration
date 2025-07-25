import React, { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CodeInputProps {
  value: string[];
  onChange: (code: string[]) => void;
  length?: number;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  onComplete?: (code: string) => void;
  autoFocus?: boolean;
}

export function CodeInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  error = false,
  className,
  onComplete,
  autoFocus = true,
}: CodeInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
      setFocusedIndex(0);
    }
  }, [autoFocus]);

  // Handle completion callback
  useEffect(() => {
    if (value.length === length && value.every(v => v !== "") && onComplete) {
      onComplete(value.join(""));
    }
  }, [value, length, onComplete]);

  const handleInputChange = useCallback((index: number, inputValue: string) => {
    // Only allow single digits
    const digit = inputValue.replace(/\D/g, "").slice(-1);
    
    const newValue = [...value];
    newValue[index] = digit;
    onChange(newValue);

    // Auto-focus next input if digit was entered
    if (digit && index < length - 1) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        setFocusedIndex(index + 1);
      }
    }
  }, [value, onChange, length]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      
      const newValue = [...value];
      
      if (newValue[index]) {
        // Clear current input
        newValue[index] = "";
        onChange(newValue);
      } else if (index > 0) {
        // Move to previous input and clear it
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          newValue[index - 1] = "";
          onChange(newValue);
          prevInput.focus();
          setFocusedIndex(index - 1);
        }
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
        setFocusedIndex(index - 1);
      }
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        setFocusedIndex(index + 1);
      }
    } else if (e.key === "Delete") {
      e.preventDefault();
      const newValue = [...value];
      newValue[index] = "";
      onChange(newValue);
    }
  }, [value, onChange, length]);

  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedIndex(null);
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    
    if (pastedData.length > 0) {
      const newValue = Array(length).fill("");
      for (let i = 0; i < Math.min(pastedData.length, length); i++) {
        newValue[i] = pastedData[i];
      }
      onChange(newValue);
      
      // Focus the next empty input or the last input
      const nextEmptyIndex = newValue.findIndex(v => v === "");
      const focusIndex = nextEmptyIndex === -1 ? length - 1 : Math.min(nextEmptyIndex, length - 1);
      
      const targetInput = inputRefs.current[focusIndex];
      if (targetInput) {
        targetInput.focus();
        setFocusedIndex(focusIndex);
      }
    }
  }, [length, onChange]);

  return (
    <div className={cn("flex gap-3 justify-center", className)}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-xl font-semibold rounded-lg border-2 transition-all",
            "bg-white text-gray-900 placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "hover:border-gray-300",
            focusedIndex === index && "ring-2 ring-blue-500 border-blue-500",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500",
            disabled && "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200",
            !error && !disabled && "border-gray-200"
          )}
          aria-label={`Digit ${index + 1} of ${length}`}
        />
      ))}
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ResendCodeButtonProps {
  onResend: () => Promise<void>;
  cooldownSeconds?: number;
  disabled?: boolean;
  className?: string;
}

export function ResendCodeButton({
  onResend,
  cooldownSeconds = 60,
  disabled = false,
  className,
}: ResendCodeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (disabled || isLoading || countdown > 0) return;

    try {
      setIsLoading(true);
      await onResend();
      setCountdown(cooldownSeconds);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = disabled || isLoading || countdown > 0;

  return (
    <button
      type="button"
      onClick={handleResend}
      disabled={isDisabled}
      className={cn(
        "text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors",
        isDisabled && "text-gray-400 cursor-not-allowed hover:text-gray-400",
        className
      )}
    >
      {isLoading
        ? "Sending..."
        : countdown > 0
          ? `Resend code in ${countdown}s`
          : "Resend a new code"}
    </button>
  );
}

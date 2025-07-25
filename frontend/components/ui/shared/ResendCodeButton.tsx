import React from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRateLimiting } from "@/hooks/auth/useRateLimiting";

interface ResendCodeButtonProps {
  onResend: () => Promise<void>;
  disabled?: boolean;
  className?: string;
  variant?: 'link' | 'button';
  rateLimitKey?: string;
  maxAttempts?: number;
  children?: React.ReactNode;
}

export function ResendCodeButton({
  onResend,
  disabled = false,
  className,
  variant = 'link',
  rateLimitKey = 'resend_code',
  maxAttempts = 3,
  children,
}: ResendCodeButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  
  const {
    canAttempt,
    isRateLimited,
    remainingTime,
    recordAttempt,
    formatRemainingTime,
    attemptCount,
  } = useRateLimiting(rateLimitKey, {
    context: "resend",
  });

  const handleResend = async () => {
    if (!canAttempt || disabled || isLoading) return;

    setIsLoading(true);
    
    try {
      await onResend();
      recordAttempt(true);
    } catch (error) {
      recordAttempt(false);
      console.error('Resend failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = disabled || isLoading || !canAttempt;

  const getButtonText = () => {
    if (isLoading) return "Sending...";
    if (isRateLimited) return `Wait ${formatRemainingTime()}`;
    if (remainingTime && remainingTime !== "0s" && remainingTime !== "") return `Resend in ${remainingTime}`;
    if (attemptCount === 0) return "Resend code";
    return "Resend again";
  };

  const buttonContent = (
    <>
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
      )}
      {children || getButtonText()}
    </>
  );

  if (variant === 'link') {
    return (
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={isDisabled}
            className={cn(
              "font-medium transition-colors inline-flex items-center",
              isDisabled
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:text-blue-800 cursor-pointer underline",
              className
            )}
          >
            {buttonContent}
          </button>
        </p>
        
        {(isRateLimited || attemptCount > 0) && (
          <p className="text-xs text-gray-500 mt-1">
            {isRateLimited 
              ? `Too many attempts. Please wait ${formatRemainingTime()} before trying again.`
              : `${attemptCount}/${maxAttempts} attempts used`
            }
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleResend}
        disabled={isDisabled}
        className={cn(
          "w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all",
          "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          isDisabled 
            ? "opacity-50 cursor-not-allowed hover:bg-white" 
            : "cursor-pointer",
          className
        )}
      >
        {buttonContent}
      </button>
      
      {(isRateLimited || attemptCount > 0) && (
        <p className="text-xs text-gray-500 text-center">
          {isRateLimited 
            ? `Too many attempts. Please wait ${formatRemainingTime()} before trying again.`
            : `${attemptCount}/${maxAttempts} attempts used`
          }
        </p>
      )}
    </div>
  );
}
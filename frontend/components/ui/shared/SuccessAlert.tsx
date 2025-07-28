import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessAlertProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function SuccessAlert({
  message,
  onDismiss,
  className,
}: SuccessAlertProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-center bg-green-50 text-green-700 p-4 rounded-lg border border-green-200",
        className
      )}
      role="alert"
    >
      <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span className="text-base font-medium flex-1">
        {message}
      </span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-3 flex-shrink-0 hover:bg-green-100 rounded-lg transition-all p-1 cursor-pointer"
          aria-label="Dismiss success message"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
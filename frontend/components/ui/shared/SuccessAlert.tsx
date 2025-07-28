import React from "react";
import { CheckCircle, X } from "lucide-react";
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
  return (
    <div
      className={cn(
        "flex items-center bg-green-50 text-green-700 p-4 rounded-lg border border-green-200",
        className
      )}
      role="alert"
    >
      <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
      <span className="text-base font-medium flex-1">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-3 flex-shrink-0 hover:bg-green-100 rounded-lg transition-all p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

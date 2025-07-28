import React from "react";
import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorAlert({ message, onDismiss, className }: ErrorAlertProps) {
  return (
    <div
      className={cn(
        "flex items-center bg-red-50 text-red-700 p-4 rounded-lg border border-red-200",
        className
      )}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
      <span className="text-base font-medium flex-1">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-3 flex-shrink-0 hover:bg-red-100 rounded-lg transition-all p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

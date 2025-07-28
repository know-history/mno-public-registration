import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  loadingText?: string;
  type?: 'submit' | 'button' | 'reset';
  onClick?: () => void;
}

export function SubmitButton({
  children,
  loading = false,
  disabled = false,
  className,
  loadingText,
  type = 'submit',
  onClick,
  ...props
}: SubmitButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        "w-full py-3.5 text-base font-semibold rounded-lg transition-all",
        isDisabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl cursor-pointer",
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white pr-2" />
          {loadingText || children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
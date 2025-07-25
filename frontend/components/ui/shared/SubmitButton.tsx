import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loadingText?: string;
  type?: 'submit' | 'button' | 'reset';
  onClick?: () => void;
}

const variants = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
  danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-base",
  lg: "px-6 py-4 text-lg",
};

export function SubmitButton({
  children,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
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
        "w-full font-semibold rounded-lg transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        isDisabled 
          ? "opacity-50 cursor-not-allowed" 
          : "cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center">
        {loading && (
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        )}
        {loading && loadingText ? loadingText : children}
      </div>
    </button>
  );
}
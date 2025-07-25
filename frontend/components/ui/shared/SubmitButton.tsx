import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SubmitButtonProps } from "@/lib/auth/types/form.types";

export function SubmitButton({
  children,
  loading = false,
  disabled = false,
  variant = "primary",
  className,
}: SubmitButtonProps) {
  const isDisabled = loading || disabled;

  const baseClasses =
    "w-full py-3.5 text-base font-semibold rounded-lg transition-all";

  const variantClasses = {
    primary: isDisabled
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl cursor-pointer",
    secondary: isDisabled
      ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 cursor-pointer",
  };

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <Loader2 className="animate-spin h-5 w-5 mr-2" />
          {typeof children === "string" ? "Loading..." : children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

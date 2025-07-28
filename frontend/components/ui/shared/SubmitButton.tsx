import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  loading?: boolean;
  disabled?: boolean;
  text: string;
  loadingText?: string;
  className?: string;
  type?: "submit" | "button";
  onClick?: () => void;
}

export function SubmitButton({
  loading = false,
  disabled = false,
  text,
  loadingText = "Loading...",
  className,
  type = "submit",
  onClick,
}: SubmitButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={cn(
        "w-full py-3.5 text-base font-semibold rounded-lg transition-all",
        loading || disabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer",
        className
      )}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          {loadingText}
        </div>
      ) : (
        text
      )}
    </button>
  );
}
import React, { useEffect } from "react";
import { X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  children: React.ReactNode;
  onClose?: () => void;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  showCloseButton?: boolean;
  showBackButton?: boolean;
  backButtonText?: string;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

export function AuthModal({
  children,
  onClose,
  onBack,
  title,
  subtitle,
  showCloseButton = true,
  showBackButton = false,
  backButtonText = "Back",
  closeOnEscape = true,
  closeOnOverlayClick = true,
  className,
}: AuthModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!closeOnEscape || !onClose) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeOnEscape, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && onClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto px-4 py-8"
      onClick={handleOverlayClick}
    >
      <div className="min-h-full flex items-center justify-center p-4">
        <div 
          className={cn(
            "bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md relative",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 pb-4">
            {showBackButton && onBack ? (
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-800 text-base font-medium transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {backButtonText}
              </button>
            ) : (
              <div />
            )}

            {showCloseButton && onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {title && (
            <div className="px-6 pb-4">
              <div className="text-center">
                <h4 className="text-3xl font-bold text-gray-900">{title}</h4>
                {subtitle && (
                  <p className="text-gray-600 mt-4">{subtitle}</p>
                )}
              </div>
            </div>
          )}

          <div className="px-6 pb-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect } from "react";
import { X, ArrowLeft } from "lucide-react";

interface AuthModalProps {
  children: React.ReactNode;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  onBack?: () => void;
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

export function AuthModal({
  children,
  onClose,
  title,
  subtitle,
  showBackButton = false,
  backButtonText = "Back",
  onBack,
  showCloseButton = true,
  closeOnEscape = true,
  className = "",
}: AuthModalProps) {
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!closeOnEscape || !onClose) return;
    
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, closeOnEscape]);

  return (
    <div 
      className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4"
    >
      <div 
        className={`bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 pb-4">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="absolute left-6 top-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">{backButtonText}</span>
            </button>
          )}

          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          )}

          <div className={`text-center ${showBackButton ? 'mt-8' : 'mt-2'}`}>
            {title && (
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-600 text-sm">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}
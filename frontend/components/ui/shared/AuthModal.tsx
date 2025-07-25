import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  children: React.ReactNode;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function AuthModal({
  children,
  onClose,
  title,
  subtitle,
  showCloseButton = true,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  className,
  size = 'md',
}: AuthModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");
    
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("modal-open");
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm modal-container"
      onClick={handleOverlayClick}
    >
      <div 
        className={cn(
          "relative w-full bg-white rounded-2xl shadow-2xl border border-gray-200",
          "transform transition-all duration-200 ease-out",
          "animate-in fade-in-0 zoom-in-95",
          sizes[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || subtitle || showCloseButton) && (
          <div className="flex items-start justify-between p-6 border-b border-gray-100">
            <div className="flex-1">
              {title && (
                <h2 className="text-2xl text-center font-bold text-gray-900 mb-2">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-gray-600 text-center text-base leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            
            {showCloseButton && onClose && (
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors",
                  "rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                )}
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        )}

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useRef, useEffect, useState } from "react";
import { X, AlertCircle, ArrowLeft } from "lucide-react";

interface ConfirmSignUpProps {
  loading: boolean;
  error: string;
  confirmationCode: string[];
  onChangeCodeAction: (code: string[]) => void;
  onSubmitAction: () => void | Promise<void>;
  onBackAction: () => void;
  onClose?: () => void;
}

export default function ConfirmSignUp({
  loading,
  error,
  confirmationCode,
  onChangeCodeAction,
  onSubmitAction,
  onBackAction,
  onClose,
}: ConfirmSignUpProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [dismissibleError, setDismissibleError] = useState<string>("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (onClose) {
          onClose();
        } else {
          onBackAction();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onBackAction, onClose]);

  useEffect(() => {
    if (error) {
      let processedError = error;

      if (error.includes("CodeMismatchException")) {
        processedError = "Invalid confirmation code. Please try again.";
      } else if (error.includes("ExpiredCodeException")) {
        processedError =
          "Confirmation code has expired. Please request a new one.";
      } else if (error.includes("LimitExceededException")) {
        processedError = "Too many attempts. Please try again later.";
      } else if (error.includes("NotAuthorizedException")) {
        processedError = "Invalid confirmation code";
      }

      setDismissibleError(processedError);
    } else {
      setDismissibleError("");
    }
  }, [error]);

  const handleCloseClick = () => {
    if (onClose) {
      onClose();
    } else {
      onBackAction();
    }
  };

  const dismissError = () => {
    setDismissibleError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    const index = inputRefs.current.findIndex((ref) => ref === e.target);

    if ((e.key === "Delete" || e.key === "Backspace") && index >= 0) {
      onChangeCodeAction([
        ...confirmationCode.slice(0, index),
        "",
        ...confirmationCode.slice(index + 1),
      ]);
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const index = inputRefs.current.findIndex((ref) => ref === e.target);
    if (index === -1) return;

    if (value) {
      onChangeCodeAction([
        ...confirmationCode.slice(0, index),
        value,
        ...confirmationCode.slice(index + 1),
      ]);
      if (index < confirmationCode.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${confirmationCode.length}}$`).test(text)) return;
    onChangeCodeAction(text.split(""));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto px-4 py-8">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md relative">
          {/* Header with Back and Close */}
          <div className="flex items-center justify-between p-6 pb-4">
            <button
              onClick={onBackAction}
              className="flex items-center text-gray-600 hover:text-gray-800 text-base font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign Up
            </button>

            <button
              onClick={handleCloseClick}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 pb-8">
            <div className="text-center mb-8">
              <h4 className="text-3xl font-bold text-gray-900">Confirm Your Email</h4>
              <p className="text-gray-600 mt-4">
                Enter the confirmation code that was sent to your email.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmitAction();
              }}
              className="space-y-6"
            >
              <div className="flex justify-center gap-2 px-2">
                {confirmationCode.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onPaste={handlePaste}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    className="w-12 h-12 border border-gray-300 rounded-lg text-gray-900 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ))}
              </div>

              {dismissibleError && (
                <div
                  className="flex items-center bg-red-50 text-red-700 p-4 rounded-lg border border-red-200"
                  role="alert"
                >
                  <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-base font-medium flex-1">{dismissibleError}</span>
                  <button
                    onClick={dismissError}
                    className="ml-3 flex-shrink-0 hover:bg-red-100 rounded-lg transition-all p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  loading ||
                  confirmationCode.some((d) => d === "") ||
                  confirmationCode.length !== 6
                }
                className={`w-full py-3.5 text-base font-semibold rounded-lg transition-all ${
                  loading || confirmationCode.some((d) => d === "")
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                }`}
              >
                {loading ? "Confirming..." : "Confirm"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useRef, useEffect, useState } from "react";
import { X, AlertCircle } from "lucide-react";

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
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto px-4 py-8">
      <button
        onClick={handleCloseClick}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-md mx-auto mt-12 space-y-6">
        <div className="text-center">
          <h4 className="text-3xl text-[#333] font-bold">Confirm Your Email</h4>
          <p className="text-sm text-[#333] mt-4">
            Enter the confirmation code that was sent to your email.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitAction();
          }}
          className="space-y-4"
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
                className="w-12 h-12 border border-gray-300 rounded-lg text-[#333] text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ))}
          </div>

          {dismissibleError && (
            <div
              className="flex items-center bg-red-100 text-red-800 p-3 rounded-lg relative"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium flex-1">
                {dismissibleError}
              </span>
              <button
                onClick={dismissError}
                className="ml-3 flex-shrink-0 hover:bg-red-200 rounded-lg transition-all p-1"
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
            className={`w-full py-2.5 text-white font-medium rounded-lg ${
              loading || confirmationCode.some((d) => d === "")
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Confirming..." : "Confirm"}
          </button>

          <button
            type="button"
            onClick={onBackAction}
            className="text-blue-600 text-center hover:underline block w-full"
          >
            Back to Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

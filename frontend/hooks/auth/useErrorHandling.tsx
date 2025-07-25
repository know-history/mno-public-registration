import { useState, useEffect, useCallback } from "react";
import {
  processAuthError,
  isRateLimitError,
  isConfirmationRequiredError,
  getContextualErrorMessage,
  shouldShowError,
} from "@/lib/auth/utils/errorHandling";

interface UseErrorHandlingOptions {
  context?: "login" | "signup" | "reset";
  autoReset?: boolean;
  autoResetDelay?: number;
}

interface UseErrorHandlingReturn {
  errorMessage: string;
  hasError: boolean;
  isRateLimitError: boolean;
  isConfirmationRequired: boolean;
  dismissError: () => void;
  setError: (error: unknown) => void;
  clearError: () => void;
}

export function useErrorHandling(
  initialError?: unknown,
  options: UseErrorHandlingOptions = {}
): UseErrorHandlingReturn {
  const {
    context = "login",
    autoReset = false,
    autoResetDelay = 5000,
  } = options;

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isRateLimitErrorState, setIsRateLimitError] = useState(false);
  const [isConfirmationRequiredState, setIsConfirmationRequired] =
    useState(false);

  const processError = useCallback(
    (error: unknown) => {
      if (!error) {
        setErrorMessage("");
        setIsRateLimitError(false);
        setIsConfirmationRequired(false);
        return;
      }

      const shouldShow = shouldShowError(error, context);
      if (!shouldShow) {
        setErrorMessage("");
        setIsRateLimitError(false);
        setIsConfirmationRequired(false);
        return;
      }

      const processedMessage = context
        ? getContextualErrorMessage(error, context)
        : processAuthError(error);

      setErrorMessage(processedMessage);
      setIsRateLimitError(isRateLimitError(error));
      setIsConfirmationRequired(isConfirmationRequiredError(error));
    },
    [context]
  );

  useEffect(() => {
    processError(initialError);
  }, [initialError, processError]);

  useEffect(() => {
    if (autoReset && errorMessage && autoResetDelay > 0) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setIsRateLimitError(false);
        setIsConfirmationRequired(false);
      }, autoResetDelay);

      return () => clearTimeout(timer);
    }
  }, [autoReset, errorMessage, autoResetDelay]);

  const dismissError = useCallback(() => {
    setErrorMessage("");
    setIsRateLimitError(false);
    setIsConfirmationRequired(false);
  }, []);

  const setError = useCallback(
    (error: unknown) => {
      processError(error);
    },
    [processError]
  );

  const clearError = useCallback(() => {
    setErrorMessage("");
    setIsRateLimitError(false);
    setIsConfirmationRequired(false);
  }, []);

  return {
    errorMessage,
    hasError: Boolean(errorMessage),
    isRateLimitError: isRateLimitErrorState,
    isConfirmationRequired: isConfirmationRequiredState,
    dismissError,
    setError,
    clearError,
  };
}

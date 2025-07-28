import { AuthError } from "../types/auth.types";
import { ERROR_MESSAGES } from "../constants";

export function processAuthError(error: unknown): string {
  if (!error) return "";

  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorString = errorMessage.toLowerCase();

  if (
    errorString.includes(AuthError.INVALID_CREDENTIALS.toLowerCase()) ||
    errorString.includes("incorrect username or password")
  ) {
    return ERROR_MESSAGES.INVALID_CREDENTIALS;
  }

  if (
    errorString.includes(AuthError.USER_NOT_CONFIRMED.toLowerCase()) ||
    errorString.includes("not confirmed")
  ) {
    return ERROR_MESSAGES.USER_NOT_CONFIRMED;
  }

  if (errorString.includes(AuthError.USER_NOT_FOUND.toLowerCase())) {
    return ERROR_MESSAGES.USER_NOT_FOUND;
  }

  if (
    errorString.includes(AuthError.CODE_MISMATCH.toLowerCase()) ||
    errorString.includes("invalid verification code")
  ) {
    return ERROR_MESSAGES.CODE_MISMATCH;
  }

  if (errorString.includes(AuthError.EXPIRED_CODE.toLowerCase())) {
    return ERROR_MESSAGES.EXPIRED_CODE;
  }

  if (errorString.includes(AuthError.LIMIT_EXCEEDED.toLowerCase())) {
    return ERROR_MESSAGES.LIMIT_EXCEEDED;
  }

  if (errorString.includes(AuthError.TOO_MANY_REQUESTS.toLowerCase())) {
    return ERROR_MESSAGES.TOO_MANY_REQUESTS;
  }

  if (errorString.includes(AuthError.INVALID_PARAMETER.toLowerCase())) {
    return "Invalid input provided.";
  }

  return errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG;
}

export function isRateLimitError(error: unknown): boolean {
  if (!error) return false;

  const errorMessage = error instanceof Error ? error.message : String(error);
  return errorMessage
    .toLowerCase()
    .includes(AuthError.LIMIT_EXCEEDED.toLowerCase());
}

export function isConfirmationRequiredError(error: unknown): boolean {
  if (!error) return false;

  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorString = errorMessage.toLowerCase();

  return (
    errorString.includes(AuthError.USER_NOT_CONFIRMED.toLowerCase()) ||
    errorString.includes("not confirmed")
  );
}

export function shouldShowError(
  error: unknown,
  context: "login" | "signup" | "reset"
): boolean {
  if (!error) return false;

  if (context === "reset") {
    return isRateLimitError(error);
  }

  return true;
}

export function getContextualErrorMessage(
  error: unknown,
  context: "login" | "signup" | "reset"
): string {
  if (!shouldShowError(error, context)) {
    return "";
  }

  return processAuthError(error);
}

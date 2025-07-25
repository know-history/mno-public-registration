import { RATE_LIMIT } from "../constants";
import { RateLimitState } from "../types/auth.types";

export function getNextCountdown(attempts: number): number {
  if (attempts === 0) return RATE_LIMIT.INITIAL_DELAY;
  if (attempts === 1) return RATE_LIMIT.ESCALATED_DELAY;
  return RATE_LIMIT.LOCKOUT_DURATION;
}

export function shouldRateLimit(attempts: number): boolean {
  return attempts >= RATE_LIMIT.MAX_ATTEMPTS;
}

export function getAwsRateLimitCountdown(): number {
  return RATE_LIMIT.AWS_FALLBACK_DELAY;
}

export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "";

  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${seconds}s`;
}

export function getRateLimitMessage(
  attempts: number,
  countdown: number,
  context: "resend" | "submit"
): string {
  if (countdown <= 0) {
    if (attempts > 0) {
      const remaining = RATE_LIMIT.MAX_ATTEMPTS - attempts;
      return context === "resend"
        ? `Resend a new code (${remaining} attempts left)`
        : "Try again";
    }
    return context === "resend" ? "Resend a new code" : "Submit";
  }

  const timeString = formatCountdown(countdown);

  if (attempts >= RATE_LIMIT.MAX_ATTEMPTS) {
    return `Wait ${timeString} to try again`;
  }

  return `Try again in ${timeString}`;
}

export function createInitialRateLimitState(): RateLimitState {
  return {
    attempts: 0,
    countdown: 0,
    isLimited: false,
    loading: false,
  };
}

export function updateRateLimitState(
  currentState: RateLimitState,
  wasSuccessful: boolean,
  wasRateLimited: boolean = false
): RateLimitState {
  if (wasSuccessful) {
    return createInitialRateLimitState();
  }

  const newAttempts = currentState.attempts + 1;

  if (wasRateLimited) {
    return {
      attempts: newAttempts,
      countdown: getAwsRateLimitCountdown(),
      isLimited: true,
      loading: false,
    };
  }

  if (shouldRateLimit(newAttempts)) {
    return {
      attempts: newAttempts,
      countdown: RATE_LIMIT.LOCKOUT_DURATION,
      isLimited: true,
      loading: false,
    };
  }

  return {
    attempts: newAttempts,
    countdown: getNextCountdown(newAttempts - 1),
    isLimited: false,
    loading: false,
  };
}

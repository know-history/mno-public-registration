import { useState, useEffect, useCallback } from "react";
import { 
  createInitialRateLimitState,
  updateRateLimitState,
  formatCountdown,
  getRateLimitMessage,
  shouldRateLimit
} from "@/lib/auth/utils/rateLimiting";
import { RateLimitState } from "@/lib/auth/types/auth.types";

interface UseRateLimitingOptions {
  storageKey?: string;
  context?: "resend" | "submit";
}

interface UseRateLimitingReturn {
  rateLimitState: RateLimitState;
  canAttempt: boolean;
  remainingTime: string;
  buttonText: string;
  isRateLimited: boolean;
  attemptCount: number;
  formatRemainingTime: () => string;
  recordAttempt: (wasSuccessful: boolean, wasRateLimited?: boolean) => void;
  resetState: () => void;
}

export function useRateLimiting(
  action: string,
  options: UseRateLimitingOptions = {}
): UseRateLimitingReturn {
  const { storageKey, context = "submit" } = options;
  const finalStorageKey = storageKey || `rate_limit_${action}`;
  
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>(
    createInitialRateLimitState()
  );

  // Load persisted state on mount
  useEffect(() => {
    const stored = localStorage.getItem(finalStorageKey);
    if (stored) {
      try {
        const { attempts, timestamp } = JSON.parse(stored);
        const now = Date.now();
        const timeDiff = Math.floor((now - timestamp) / 1000);
        
        // If enough time has passed, reset
        if (timeDiff > 300) { // 5 minutes
          localStorage.removeItem(finalStorageKey);
          setRateLimitState(createInitialRateLimitState());
          return;
        }
        
        // Calculate remaining countdown
        let countdown = 0;
        if (shouldRateLimit(attempts)) {
          countdown = Math.max(0, 300 - timeDiff); // 5 minutes lockout
        } else if (attempts > 0) {
          const delay = attempts === 1 ? 60 : 120; // 1 or 2 minutes
          countdown = Math.max(0, delay - timeDiff);
        }
        
        setRateLimitState({
          attempts,
          countdown,
          isLimited: shouldRateLimit(attempts) && countdown > 0,
          loading: false,
        });
      } catch {
        localStorage.removeItem(finalStorageKey);
        setRateLimitState(createInitialRateLimitState());
      }
    }
  }, [finalStorageKey]);

  // Countdown timer
  useEffect(() => {
    if (rateLimitState.countdown > 0) {
      const timer = setInterval(() => {
        setRateLimitState(prev => {
          const newCountdown = prev.countdown - 1;
          
          if (newCountdown <= 0) {
            return {
              ...prev,
              countdown: 0,
              isLimited: false,
            };
          }
          
          return {
            ...prev,
            countdown: newCountdown,
          };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [rateLimitState.countdown]);

  const recordAttempt = useCallback((wasSuccessful: boolean, wasRateLimited: boolean = false) => {
    const newState = updateRateLimitState(rateLimitState, wasSuccessful, wasRateLimited);
    setRateLimitState(newState);
    
    if (wasSuccessful) {
      localStorage.removeItem(finalStorageKey);
    } else {
      // Persist failed attempt
      localStorage.setItem(finalStorageKey, JSON.stringify({
        attempts: newState.attempts,
        timestamp: Date.now(),
      }));
    }
  }, [rateLimitState, finalStorageKey]);

  const resetState = useCallback(() => {
    setRateLimitState(createInitialRateLimitState());
    localStorage.removeItem(finalStorageKey);
  }, [finalStorageKey]);

  const canAttempt = !rateLimitState.isLimited && rateLimitState.countdown === 0 && !rateLimitState.loading;
  const remainingTime = formatCountdown(rateLimitState.countdown);
  const buttonText = getRateLimitMessage(rateLimitState.attempts, rateLimitState.countdown, context);
  const isRateLimited = rateLimitState.isLimited;
  const attemptCount = rateLimitState.attempts;

  const formatRemainingTime = useCallback(() => {
    return formatCountdown(rateLimitState.countdown);
  }, [rateLimitState.countdown]);

  return {
    rateLimitState,
    canAttempt,
    remainingTime,
    buttonText,
    isRateLimited,
    attemptCount,
    formatRemainingTime,
    recordAttempt,
    resetState,
  };
}
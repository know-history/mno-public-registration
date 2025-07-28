import { useState, useEffect, useMemo } from "react";
import {
  validatePassword,
  isPasswordValid,
  getPasswordStrength,
  updatePasswordRequirements,
} from "@/lib/auth/utils/passwordValidation";
import { PasswordValidationRules } from "@/lib/auth/types/auth.types";

interface UsePasswordValidationReturn {
  rules: PasswordValidationRules;
  requirements: Array<{ key: string; label: string; met: boolean }>;
  strength: number;
  isValid: boolean;
  canSubmit: boolean;
}

export function usePasswordValidation(
  password: string | undefined
): UsePasswordValidationReturn {
  const safePassword = password || "";
  
  const [rules, setRules] = useState<PasswordValidationRules>({
    minLength: false,
    lowercase: false,
    uppercase: false,
    numbers: false,
    specialChars: false,
  });

  const [requirements, setRequirements] = useState<
    Array<{ key: string; label: string; met: boolean }>
  >([]);

  useEffect(() => {
    const validationRules = validatePassword(safePassword);
    const requirementsList = updatePasswordRequirements(safePassword);

    setRules(validationRules);
    setRequirements(requirementsList);
  }, [safePassword]);

  const strength = useMemo(() => getPasswordStrength(safePassword), [safePassword]);
  const isValid = useMemo(() => isPasswordValid(safePassword), [safePassword]);
  const canSubmit = useMemo(
    () => safePassword.length >= 8 && isValid,
    [safePassword, isValid]
  );

  return {
    rules,
    requirements,
    strength,
    isValid,
    canSubmit,
  };
}
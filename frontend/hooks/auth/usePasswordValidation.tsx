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
  password: string
): UsePasswordValidationReturn {
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
    const validationRules = validatePassword(password);
    const requirementsList = updatePasswordRequirements(password);

    setRules(validationRules);
    setRequirements(requirementsList);
  }, [password]);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const isValid = useMemo(() => isPasswordValid(password), [password]);
  const canSubmit = useMemo(
    () => password.length >= 8 && isValid,
    [password, isValid]
  );

  return {
    rules,
    requirements,
    strength,
    isValid,
    canSubmit,
  };
}

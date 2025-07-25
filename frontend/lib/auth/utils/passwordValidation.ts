import { PASSWORD_RULES, PASSWORD_REQUIREMENTS } from "../constants";
import { PasswordValidationRules } from "../types/auth.types";

export function validatePassword(password: string): PasswordValidationRules {
  if (!password) {
    return {
      minLength: false,
      lowercase: false,
      uppercase: false,
      numbers: false,
      specialChars: false,
    };
  }

  return {
    minLength: password.length >= PASSWORD_RULES.MIN_LENGTH,
    lowercase: PASSWORD_RULES.REQUIRE_LOWERCASE ? /[a-z]/.test(password) : true,
    uppercase: PASSWORD_RULES.REQUIRE_UPPERCASE ? /[A-Z]/.test(password) : true,
    numbers: PASSWORD_RULES.REQUIRE_NUMBERS ? /\d/.test(password) : true,
    specialChars: PASSWORD_RULES.REQUIRE_SPECIAL_CHARS
      ? PASSWORD_RULES.SPECIAL_CHAR_PATTERN.test(password)
      : true,
  };
}

export function isPasswordValid(password: string): boolean {
  const rules = validatePassword(password);
  return Object.values(rules).every(Boolean);
}

export function getPasswordStrength(password: string): number {
  const rules = validatePassword(password);
  const metRules = Object.values(rules).filter(Boolean).length;
  const totalRules = Object.values(rules).length;
  return Math.round((metRules / totalRules) * 100);
}

export function getPasswordRequirements(): Array<{
  key: string;
  label: string;
  met: boolean;
}> {
  return [
    { key: "minLength", label: PASSWORD_REQUIREMENTS.MIN_LENGTH, met: false },
    { key: "lowercase", label: PASSWORD_REQUIREMENTS.LOWERCASE, met: false },
    { key: "uppercase", label: PASSWORD_REQUIREMENTS.UPPERCASE, met: false },
    { key: "numbers", label: PASSWORD_REQUIREMENTS.NUMBERS, met: false },
    {
      key: "specialChars",
      label: PASSWORD_REQUIREMENTS.SPECIAL_CHARS,
      met: false,
    },
  ];
}

export function updatePasswordRequirements(
  password: string
): Array<{ key: string; label: string; met: boolean }> {
  const rules = validatePassword(password);
  return getPasswordRequirements().map((req) => ({
    ...req,
    met: rules[req.key as keyof PasswordValidationRules],
  }));
}

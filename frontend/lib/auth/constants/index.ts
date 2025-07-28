export const RATE_LIMIT = {
  INITIAL_DELAY: 60,
  ESCALATED_DELAY: 120,
  MAX_ATTEMPTS: 2,
  LOCKOUT_DURATION: 600,
  AWS_FALLBACK_DELAY: 180,
} as const;

export const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  REQUIRE_LOWERCASE: true,
  REQUIRE_UPPERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL_CHARS: true,
  SPECIAL_CHAR_PATTERN: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
} as const;

export const CONFIRMATION = {
  CODE_LENGTH: 6,
  CODE_PATTERN: /^[0-9]{6}$/,
  RESEND_TEXT: "It may take a minute to receive your code. Didn't receive it?",
  RESEND_LINK_TEXT: "Resend a new code",
} as const;

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Invalid email address",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters",
  PASSWORD_CONFIRMATION_REQUIRED: "Please confirm your password",
  PASSWORDS_DONT_MATCH: "Passwords do not match",
  FIRST_NAME_REQUIRED: "First name is required",
  LAST_NAME_REQUIRED: "Last name is required",
  DATE_OF_BIRTH_REQUIRED: "Date of birth is required",
  DATE_OF_BIRTH_INVALID: "Date of birth must be a valid date",
  CODE_REQUIRED: "Confirmation code is required",
  CODE_INVALID: "Code must be 6 digits",
} as const;

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Incorrect email or password",
  USER_NOT_FOUND: "User not found",
  USER_NOT_CONFIRMED:
    "Account not confirmed. Please check your email for confirmation code.",
  TOO_MANY_REQUESTS: "Too many attempts. Please try again later.",

  CODE_MISMATCH:
    "Invalid confirmation code. Please check your email and try again.",
  EXPIRED_CODE: "Confirmation code expired. Please request a new one.",
  INVALID_CODE: "Invalid confirmation code",

  LIMIT_EXCEEDED: "Too many attempts. Please wait before trying again.",
  RESEND_LIMIT: "Too many resend attempts. Please wait before trying again.",

  SOMETHING_WENT_WRONG: "Something went wrong. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
} as const;

export const SUCCESS_MESSAGES = {
  PASSWORD_RESET_SENT:
    "If an account with this email exists, you will receive a password reset code shortly.",
  PASSWORD_RESET_SUCCESS:
    "Password reset successfully! Please log in with your new password.",
  SIGNUP_SUCCESS:
    "Account confirmed successfully! Please log in with your credentials.",
  SIGNUP_CODE_SENT: "Confirmation code sent to your email.",
} as const;

export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: "At least 8 characters",
  LOWERCASE: "One lowercase letter",
  UPPERCASE: "One uppercase letter",
  NUMBERS: "One number",
  SPECIAL_CHARS: "One special character",
} as const;

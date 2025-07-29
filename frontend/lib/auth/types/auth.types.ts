export interface AuthUser {
  userId: string;
  email: string;
  given_name?: string;
  family_name?: string;
  email_verified?: boolean;
  user_role?: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    given_name?: string,
    family_name?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmResetPassword: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  resendSignUpCode: (email: string) => Promise<void>;
}

export interface PasswordValidationRules {
  minLength: boolean;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  specialChars: boolean;
}

export enum AuthError {
  INVALID_CREDENTIALS = "NotAuthorizedException",
  USER_NOT_CONFIRMED = "UserNotConfirmedException",
  USER_NOT_FOUND = "UserNotFoundException",
  CODE_MISMATCH = "CodeMismatchException",
  EXPIRED_CODE = "ExpiredCodeException",
  LIMIT_EXCEEDED = "LimitExceededException",
  TOO_MANY_REQUESTS = "TooManyRequestsException",
  INVALID_PARAMETER = "InvalidParameterException",
}

export interface UpdateProfileAttributes {
  given_name?: string;
  family_name?: string;
}

export interface EmailUpdateRequest {
  newEmail: string;
}

export interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
}

export interface EmailVerificationRequest {
  confirmationCode: string;
}

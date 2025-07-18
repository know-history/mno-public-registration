import { 
  signIn, 
  signUp, 
  confirmSignUp, 
  signOut,
  getCurrentUser,
  fetchAuthSession,
  resetPassword,
  confirmResetPassword,
  fetchUserAttributes,
} from 'aws-amplify/auth';
import awsConfigured from './aws-config';

export interface SignUpParams {
  email: string;
  password: string;
  given_name?: string;
  family_name?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface ForgotPasswordParams {
  email: string;
}

class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

const formatAuthError = (error: unknown): AuthError => {
  if (error instanceof AuthError) {
    return error;
  }

  const err = error as any;

  switch (err.name || err.__type) {
    case 'UserNotConfirmedException':
      return new AuthError('Please check your email and confirm your account before signing in.', 'USER_NOT_CONFIRMED');
    case 'NotAuthorizedException':
    case 'UserNotFoundException':
      return new AuthError('Invalid email or password. Please try again.', 'INVALID_CREDENTIALS');
    case 'UsernameExistsException':
      return new AuthError('An account with this email already exists.', 'USER_EXISTS');
    case 'InvalidPasswordException':
      return new AuthError('Password does not meet requirements.', 'INVALID_PASSWORD');
    case 'CodeMismatchException':
      return new AuthError('Invalid confirmation code. Please try again.', 'INVALID_CODE');
    case 'ExpiredCodeException':
      return new AuthError('Confirmation code has expired. Please request a new one.', 'EXPIRED_CODE');
    case 'LimitExceededException':
      return new AuthError('Too many attempts. Please wait before trying again.', 'RATE_LIMITED');
    default:
      return new AuthError(
        (err?.message as string) || 'An unexpected error occurred. Please try again.',
        'UNKNOWN_ERROR'
      );
  }
};

const checkAuthConfig = () => {
  if (!awsConfigured) {
    throw new AuthError('Authentication not configured. Please set up your environment variables.', 'AUTH_NOT_CONFIGURED');
  }
};

export const authService = {
  resetPassword: async ({ email }: ForgotPasswordParams) => {
    checkAuthConfig();
    try {
      return await resetPassword({ username: email });
    } catch (error: unknown) {
      throw formatAuthError(error);
    }
  },

  confirmResetPassword: async (email: string, confirmationCode: string, newPassword: string) => {
    checkAuthConfig();
    try {
      return await confirmResetPassword({
        username: email,
        confirmationCode,
        newPassword,
      });
    } catch (error: unknown) {
      throw formatAuthError(error);
    }
  },

  signUp: async ({ email, password, given_name, family_name }: SignUpParams) => {
    checkAuthConfig();
    try {
      return await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            given_name: given_name || '',
            family_name: family_name || '',
            'custom:user_role': 'applicant',
          }
        }
      });
    } catch (error: unknown) {
      throw formatAuthError(error);
    }
  },

  confirmSignUp: async (email: string, confirmationCode: string) => {
    checkAuthConfig();
    try {
      return await confirmSignUp({
        username: email,
        confirmationCode
      });
    } catch (error: unknown) {
      throw formatAuthError(error);
    }
  },

  signIn: async ({ email, password }: SignInParams) => {
    checkAuthConfig();
    try {
      const result = await signIn({ 
        username: email, 
        password 
      });
      
      if (result.nextStep) {
        switch (result.nextStep.signInStep) {
          case 'CONFIRM_SIGN_UP':
            throw new AuthError('Please check your email and confirm your account before signing in.', 'USER_NOT_CONFIRMED');
          case 'RESET_PASSWORD':
            throw new AuthError('You need to reset your password before signing in.', 'RESET_PASSWORD_REQUIRED');
          default:
            throw new AuthError('Additional verification required.', 'ADDITIONAL_VERIFICATION');
        }
      }
      
      return result;
    } catch (error: unknown) {
      throw formatAuthError(error);
    }
  },

  signOut: async () => {
    checkAuthConfig();
    try {
      await signOut();
    } catch (error: unknown) {
      throw formatAuthError(error);
    }
  },

  getCurrentUser: async () => {
    if (!awsConfigured) {
      return null;
    }
    try {
      return await getCurrentUser();
    } catch (error: unknown) {
      const err = error as any;
      if (err.name === 'UserUnAuthenticatedException') {
        return null;
      }
      throw formatAuthError(error);
    }
  },

  getUserAttributes: async () => {
    checkAuthConfig();
    try {
      return await fetchUserAttributes();
    } catch (error: unknown) {
      throw formatAuthError(error);
    }
  },

  getCurrentSession: async () => {
    if (!awsConfigured) {
      return null;
    }
    try {
      return await fetchAuthSession();
    } catch (error: unknown) {
      throw formatAuthError(error);
    }
  },

  hasRole: async (requiredRole: string): Promise<boolean> => {
    if (!awsConfigured) return false;
    try {
      const attributes = await authService.getUserAttributes();
      const userRole = attributes['custom:user_role'];
      return userRole === 'admin' || userRole === requiredRole;
    } catch (error: unknown) {
      return false;
    }
  },

  hasAnyRole: async (roles: string[]): Promise<boolean> => {
    if (!awsConfigured) return false;
    try {
      const attributes = await authService.getUserAttributes();
      const userRole = attributes['custom:user_role'];
      return userRole === 'admin' || roles.includes(userRole || '');
    } catch (error: unknown) {
      return false;
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    if (!awsConfigured) return false;
    try {
      const user = await authService.getCurrentUser();
      return !!user;
    } catch (error: unknown) {
      return false;
    }
  },

  getUserRole: async (): Promise<string | null> => {
    if (!awsConfigured) return null;
    try {
      const attributes = await authService.getUserAttributes();
      return attributes['custom:user_role'] || 'applicant';
    } catch (error: unknown) {
      return null;
    }
  },
};
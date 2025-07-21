import { CognitoAuthService } from './aws-cognito';

const requiredEnvVars = [
  'NEXT_PUBLIC_AWS_REGION',
  'NEXT_PUBLIC_COGNITO_USER_POOL_ID',
  'NEXT_PUBLIC_COGNITO_CLIENT_ID'
];

const validateConfig = () => {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

let authService: CognitoAuthService | null = null;

const getAuthService = () => {
  if (!authService) {
    if (typeof window === 'undefined') {
      throw new Error('Auth service only available in browser environment');
    }
    
    validateConfig();
    
    authService = new CognitoAuthService({
      region: process.env.NEXT_PUBLIC_AWS_REGION!,
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
    });
  }
  return authService;
};

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

export const auth = {
  signUp: async (params: SignUpParams) => {
    const service = getAuthService();
    return await service.signUp(params.email, params.password, params.given_name, params.family_name);
  },

  confirmSignUp: async (email: string, code: string) => {
    const service = getAuthService();
    return await service.confirmSignUp(email, code);
  },

  signIn: async (params: SignInParams) => {
    const service = getAuthService();
    return await service.signIn(params.email, params.password);
  },

  signOut: async () => {
    const service = getAuthService();
    return await service.signOut();
  },

  getCurrentUser: async () => {
    const service = getAuthService();
    return await service.getCurrentUser();
  },

  forgotPassword: async (params: ForgotPasswordParams) => {
    const service = getAuthService();
    return await service.forgotPassword(params.email);
  },

  confirmForgotPassword: async (email: string, code: string, newPassword: string) => {
    const service = getAuthService();
    return await service.confirmForgotPassword(email, code, newPassword);
  },

  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    const service = getAuthService();
    return service.isAuthenticated();
  }
};

// Backwards compatibility exports
export const {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  getCurrentUser,
  forgotPassword,
  confirmForgotPassword,
} = auth;
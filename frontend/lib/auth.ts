import { CognitoAuthService } from './aws-cognito';

const requiredEnvVars = [
  'NEXT_PUBLIC_AWS_REGION',
  'NEXT_PUBLIC_COGNITO_USER_POOL_ID', 
  'NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID'
];

const getEnvVar = (key: string): string | undefined => {
  switch (key) {
    case 'NEXT_PUBLIC_AWS_REGION':
      return process.env.NEXT_PUBLIC_AWS_REGION;
    case 'NEXT_PUBLIC_COGNITO_USER_POOL_ID':
      return process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
    case 'NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID':
      return process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;
    default:
      return undefined;
  }
};

const validateConfig = () => {
  if (typeof window === 'undefined') {
    return;
  }
  
  const missing = requiredEnvVars.filter(key => {
    const value = getEnvVar(key);
    return !value || value.trim() === '';
  });
  
  if (missing.length > 0) {
    console.error('Missing variables detected:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

let authService: CognitoAuthService | null = null;

const getAuthService = () => {
  if (typeof window === 'undefined') {
    throw new Error('Auth service only available in browser environment');
  }
  
  if (!authService) {
    validateConfig();
    
    authService = new CognitoAuthService({
      region: getEnvVar('NEXT_PUBLIC_AWS_REGION')!,
      userPoolId: getEnvVar('NEXT_PUBLIC_COGNITO_USER_POOL_ID')!,
      clientId: getEnvVar('NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID')!,
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
    if (typeof window === 'undefined') {
      return null;
    }
    
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
    try {
      const service = getAuthService();
      return service.isAuthenticated();
    } catch {
      return false;
    }
  }
};

export const {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  getCurrentUser,
  forgotPassword,
  confirmForgotPassword,
} = auth;
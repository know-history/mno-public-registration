'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService } from '@/lib/auth';
import { User, AuthState, UserRole } from '@/types/auth';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, given_name?: string, family_name?: string) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  confirmResetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const currentUser = await authService.getCurrentUser();
      
      if (currentUser) {
        const userAttributes = await authService.getUserAttributes();
        const user: User = {
          id: currentUser.userId,
          email: userAttributes.email || '', 
          given_name: userAttributes.given_name,
          family_name: userAttributes.family_name,
          user_role: (userAttributes['custom:user_role'] as UserRole) || 'applicant',
          email_verified: userAttributes.email_verified === 'true',
        };
        setState(prev => ({ ...prev, user, loading: false }));
      } else {
        setState(prev => ({ ...prev, user: null, loading: false }));
      }
    } catch (error) {
      // Don't log auth config errors in development
      if (error instanceof Error && error.message.includes('Authentication not configured')) {
        setState(prev => ({ ...prev, user: null, loading: false }));
      } else {
        console.error('Error checking user:', error);
        setState(prev => ({ 
          ...prev, 
          user: null, 
          loading: false, 
          error: 'Failed to load user session' 
        }));
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await authService.signIn({ email, password });
      await checkUser();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, given_name?: string, family_name?: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const result = await authService.signUp({ email, password, given_name, family_name });
      setState(prev => ({ ...prev, loading: false }));
      return { needsConfirmation: !result.isSignUpComplete };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await authService.signOut();
      setState(prev => ({ ...prev, user: null, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const confirmSignUp = async (email: string, code: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await authService.confirmSignUp(email, code);
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Confirmation failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await authService.resetPassword({ email });
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Reset password failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const confirmResetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await authService.confirmResetPassword(email, code, newPassword);
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset confirmation failed';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const refreshUser = async () => {
    await checkUser();
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      signIn,
      signUp,
      signOut,
      confirmSignUp,
      resetPassword,
      confirmResetPassword,
      clearError,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
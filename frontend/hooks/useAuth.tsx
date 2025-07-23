"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  useMemo,
} from "react";
import { auth } from "@/lib/auth";
import { User, AuthState, UserRole } from "@/types/auth";

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    given_name?: string,
    family_name?: string
  ) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  confirmResetPassword: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<void>;
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
    if (typeof window !== "undefined") {
      checkUser();
    } else {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const checkUser = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const currentUser = await auth.getCurrentUser();

      if (currentUser) {
        const user: User = {
          id: currentUser.username || "",
          email: currentUser.attributes.email || "",
          given_name: currentUser.attributes.given_name,
          family_name: currentUser.attributes.family_name,
          user_role:
            (currentUser.attributes["custom:user_role"] as UserRole) ||
            "applicant",
          email_verified: currentUser.attributes.email_verified === "true",
        };
        setState((prev) => ({ ...prev, user, loading: false }));
      } else {
        setState((prev) => ({ ...prev, user: null, loading: false }));
      }
    } catch (error) {
      console.error("Error checking user:", error);
      setState((prev) => ({
        ...prev,
        user: null,
        loading: false,
        error: null,
      }));
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      await auth.signIn({ email, password });
      setState((prev) => ({ ...prev, error: null }));
      await checkUser();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Sign in failed";
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    given_name?: string,
    family_name?: string
  ): Promise<{ needsConfirmation: boolean }> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const result = await auth.signUp({
        email,
        password,
        given_name,
        family_name,
      });
      setState((prev) => ({ ...prev, loading: false }));
      return { needsConfirmation: result.needsConfirmation };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Sign up failed";
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await auth.signOut();
      setState((prev) => ({ ...prev, user: null, loading: false }));
    } catch (error) {
      console.error("Sign out error:", error);
      setState((prev) => ({ ...prev, user: null, loading: false }));
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await auth.forgotPassword({ email });
      setState((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Reset password failed";
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const handleConfirmSignUp = async (email: string, code: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await auth.confirmSignUp(email, code);
      setState((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Confirmation failed";
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const handleConfirmResetPassword = async (
    email: string,
    code: string,
    newPassword: string
  ) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await auth.confirmForgotPassword(email, code, newPassword);
      setState((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Reset confirmation failed";
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  const refreshUser = async () => {
    if (typeof window !== "undefined") {
      await checkUser();
    }
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      signIn: handleSignIn,
      signUp: handleSignUp,
      signOut: handleSignOut,
      resetPassword: handleResetPassword,
      confirmSignUp: handleConfirmSignUp,
      confirmResetPassword: handleConfirmResetPassword,
      clearError,
      refreshUser,
    }),
    [
      state.user?.id,
      state.loading,
      handleSignIn,
      handleSignUp,
      handleSignOut,
      handleResetPassword,
      handleConfirmSignUp,
      handleConfirmResetPassword,
      clearError,
      refreshUser,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { authService } from "@/lib/auth";
import { AuthUser } from "aws-amplify/auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser(true);
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authService.signIn({ email, password });

      if (
        result &&
        typeof result === "object" &&
        "isSignedIn" in result &&
        !result.isSignedIn
      ) {
        const confirmError = new Error("User is not confirmed.");
        (confirmError as any).name = "UserNotConfirmedException";
        throw confirmError;
      }

      try {
        const currentUser = await authService.getCurrentUser(false);

        if (!currentUser) {
          const confirmError = new Error("User is not confirmed.");
          (confirmError as any).name = "UserNotConfirmedException";
          throw confirmError;
        }

        setUser(currentUser);
      } catch (userError: any) {
        if (
          userError?.message?.includes("not authenticated") ||
          userError?.name === "UserUnAuthenticatedException"
        ) {
          const confirmError = new Error("User is not confirmed.");
          (confirmError as any).name = "UserNotConfirmedException";
          throw confirmError;
        }
        throw userError;
      }
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    given_name?: string,
    family_name?: string
  ) => {
    try {
      await authService.signUp({ email, password, given_name, family_name });
      return;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const confirmSignUp = async (email: string, code: string) => {
    try {
      await authService.confirmSignUp(email, code);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword({ email });
    } catch (error) {
      throw error;
    }
  };

  const confirmResetPassword = async (
    email: string,
    code: string,
    newPassword: string
  ) => {
    try {
      await authService.confirmResetPassword({ email, code, newPassword });
    } catch (error) {
      throw error;
    }
  };

  const resendSignUpCode = async (email: string) => {
    try {
      await authService.resendSignUpCode({ email });
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        confirmSignUp,
        resetPassword,
        confirmResetPassword,
        resendSignUpCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

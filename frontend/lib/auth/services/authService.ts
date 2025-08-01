import {
  signIn,
  signUp,
  confirmSignUp,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  resetPassword,
  resendSignUpCode,
  confirmResetPassword,
} from "aws-amplify/auth";

interface SignUpParams {
  email: string;
  password: string;
  given_name?: string;
  family_name?: string;
}

interface SignInParams {
  email: string;
  password: string;
}

interface ForgotPasswordParams {
  email: string;
}

interface ConfirmResetPasswordParams {
  email: string;
  code: string;
  newPassword: string;
}

interface ResendSignUpCodeParams {
  email: string;
}

export const authService = {
  async signIn({ email, password }: SignInParams) {
    try {
      const result = await signIn({
        username: email,
        password,
      });
      return result;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  },

  async signUp({ email, password, given_name, family_name }: SignUpParams) {
    try {
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            given_name: given_name || "",
            family_name: family_name || "",
            "custom:user_role": "applicant",
          },
        },
      });
      return result;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  },

  async confirmSignUp(email: string, confirmationCode: string) {
    try {
      const result = await confirmSignUp({
        username: email,
        confirmationCode,
      });
      return result;
    } catch (error) {
      console.error("Confirm sign up error:", error);
      throw error;
    }
  },

  async signOut() {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  },

  async resetPassword({ email }: ForgotPasswordParams) {
    try {
      const result = await resetPassword({ username: email });
      return result;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  },

  async confirmResetPassword({
    email,
    code,
    newPassword,
  }: ConfirmResetPasswordParams) {
    try {
      const result = await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword,
      });
      return result;
    } catch (error) {
      console.error("Confirm reset password error:", error);
      throw error;
    }
  },

  async resendSignUpCode({ email }: ResendSignUpCodeParams) {
    try {
      const result = await resendSignUpCode({
        username: email,
      });
      return result;
    } catch (error) {
      console.error("Resend sign up code error:", error);
      throw error;
    }
  },

  async getCurrentUser(silentCheck: boolean = false) {
    try {
      const user = await getCurrentUser();
      return user;
    } catch (error: unknown) {
      if (
        !silentCheck &&
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        (error as { name?: string }).name !== "UserUnAuthenticatedException"
      ) {
        console.error("Get current user error:", error);
      }
      throw error;
    }
  },

  async getCurrentSession() {
    try {
      const session = await fetchAuthSession();
      return session;
    } catch (error) {
      console.error("Get current session error:", error);
      throw error;
    }
  },
};

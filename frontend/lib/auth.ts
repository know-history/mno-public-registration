import { 
  signIn, 
  signUp, 
  confirmSignUp, 
  signOut,
  getCurrentUser,
  fetchAuthSession 
} from 'aws-amplify/auth';

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

export const authService = {
  signUp: async ({ email, password, given_name, family_name }: SignUpParams) => {
    try {
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            given_name: given_name || '',
            family_name: family_name || '',
          }
        }
      });
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  confirmSignUp: async (email: string, confirmationCode: string) => {
    try {
      const result = await confirmSignUp({
        username: email,
        confirmationCode
      });
      return result;
    } catch (error) {
      console.error('Confirm sign up error:', error);
      throw error;
    }
  },

  signIn: async ({ email, password }: SignInParams) => {
    try {
      const result = await signIn({ 
        username: email, 
        password 
      });
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const user = await getCurrentUser();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  getCurrentSession: async () => {
    try {
      const session = await fetchAuthSession();
      return session;
    } catch (error) {
      console.error('Get current session error:', error);
      return null;
    }
  }
};
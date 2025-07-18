export interface User {
  id: string;
  email: string;
  given_name?: string;
  family_name?: string;
  user_role?: UserRole;
  email_verified?: boolean;
}

export type UserRole =
  | "admin"
  | "researcher"
  | "harvesting_admin"
  | "harvesting_captain"
  | "applicant";

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

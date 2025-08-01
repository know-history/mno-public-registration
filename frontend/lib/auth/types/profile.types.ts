export interface GenderType {
  id: number;
  code: string;
  html_value_en: string;
  html_value_fr: string;
}

export interface UserData {
  user: {
    id: string;
    cognito_sub: string;
    email: string;
    status: string;
    persons: Array<{
      id: string;
      user_id: string | null;
      first_name: string;
      last_name: string;
      middle_name: string | null;
      birth_date: Date | null;
      gender_id: number | null;
      another_gender_value: string | null;
      gender_types: GenderType | null;
    }>;
  };
  person: {
    id: string;
    user_id: string | null;
    first_name: string;
    last_name: string;
    middle_name: string | null;
    birth_date: Date | null;
    gender_id: number | null;
    another_gender_value: string | null;
    gender_types: GenderType | null;
  } | null;
}

export interface UpdateProfileData {
  first_name: string;
  last_name: string;
  middle_name?: string;
  birth_date: string;
  gender_id: number;
  another_gender_value?: string;
}

export interface AuthError {
  name: string;
  message: string;
}

import { z } from "zod";
import { VALIDATION_MESSAGES, PASSWORD_RULES } from "../constants";

const emailSchema = z
  .string()
  .min(1, { message: VALIDATION_MESSAGES.EMAIL_REQUIRED })
  .pipe(z.email({ message: VALIDATION_MESSAGES.EMAIL_INVALID }));

const passwordSchema = z
  .string()
  .min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED)
  .min(PASSWORD_RULES.MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH);

const confirmationCodeSchema = z
  .string()
  .min(1, VALIDATION_MESSAGES.CODE_REQUIRED)
  .length(6, VALIDATION_MESSAGES.CODE_INVALID)
  .regex(/^[0-9]{6}$/, VALIDATION_MESSAGES.CODE_INVALID);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    password_confirmation: passwordSchema,
    given_name: z.string().min(1, VALIDATION_MESSAGES.FIRST_NAME_REQUIRED),
    family_name: z.string().min(1, VALIDATION_MESSAGES.LAST_NAME_REQUIRED),
    date_of_birth: z
      .string()
      .min(1, VALIDATION_MESSAGES.DATE_OF_BIRTH_REQUIRED)
      .refine((val) => !isNaN(Date.parse(val)), {
        message: VALIDATION_MESSAGES.DATE_OF_BIRTH_INVALID,
      }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: VALIDATION_MESSAGES.PASSWORDS_DONT_MATCH,
    path: ["password_confirmation"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const confirmPasswordResetSchema = z
  .object({
    email: emailSchema,
    code: confirmationCodeSchema,
    password: passwordSchema,
    password_confirmation: passwordSchema,
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: VALIDATION_MESSAGES.PASSWORDS_DONT_MATCH,
    path: ["password_confirmation"],
  });

export const confirmSignupSchema = z.object({
  email: emailSchema,
  code: confirmationCodeSchema,
});

export const profileSchema = z.object({
  first_name: z.string().min(1, VALIDATION_MESSAGES.FIRST_NAME_REQUIRED),
  last_name: z.string().min(1, VALIDATION_MESSAGES.LAST_NAME_REQUIRED),
  middle_name: z.string().optional(),
  birth_date: z.string().min(1, VALIDATION_MESSAGES.DATE_OF_BIRTH_REQUIRED),
  gender_id: z.number().int().positive().optional(),
  another_gender_value: z.string().optional(),
});

export const profileUpdateSchema = z.object({
  first_name: z.string().min(1, VALIDATION_MESSAGES.FIRST_NAME_REQUIRED),
  last_name: z.string().min(1, VALIDATION_MESSAGES.LAST_NAME_REQUIRED),
  birth_date: z.string().optional(),
  gender_id: z.number().optional(),
});

export const passwordChangeSchema = z
  .object({
    current_password: passwordSchema,
    new_password: passwordSchema,
    confirm_password: passwordSchema,
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: VALIDATION_MESSAGES.PASSWORDS_DONT_MATCH,
    path: ["confirm_password"],
  });

export const emailChangeSchema = z.object({
  new_email: emailSchema,
  current_password: passwordSchema,
});

export const emailVerificationSchema = z.object({
  verification_code: confirmationCodeSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ConfirmPasswordResetFormData = z.infer<
  typeof confirmPasswordResetSchema
>;
export type ConfirmSignupFormData = z.infer<typeof confirmSignupSchema>;

export type ProfileFormData = z.infer<typeof profileSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
export type EmailChangeFormData = z.infer<typeof emailChangeSchema>;
export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;

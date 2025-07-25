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

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ConfirmPasswordResetFormData = z.infer<
  typeof confirmPasswordResetSchema
>;
export type ConfirmSignupFormData = z.infer<typeof confirmSignupSchema>;

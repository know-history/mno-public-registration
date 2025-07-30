"use server";

import { signIn } from "aws-amplify/auth";

interface AuthError {
  name: string;
  message: string;
}

export async function validateCurrentPassword(email: string, password: string) {
  try {
    await signIn({
      username: email,
      password: password,
    });

    return { success: true, valid: true };
  } catch (error) {
    const authError = error as AuthError;
    if (authError.name === "NotAuthorizedException") {
      return { success: true, valid: false };
    } else if (authError.name === "UserNotFoundException") {
      return { success: true, valid: false };
    } else {
      console.error("Password validation error:", error);
      return { success: false, error: "Failed to validate password" };
    }
  }
}

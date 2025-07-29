"use server";

import { signIn } from "aws-amplify/auth";

export async function validateCurrentPassword(email: string, password: string) {
  try {
    const result = await signIn({
      username: email,
      password: password,
    });

    return { success: true, valid: true };
    
  } catch (error: any) {
    if (error.name === 'NotAuthorizedException') {
      return { success: true, valid: false };
    } else if (error.name === 'UserNotFoundException') {
      return { success: true, valid: false };
    } else {
      console.error("Password validation error:", error);
      return { success: false, error: "Failed to validate password" };
    }
  }
}
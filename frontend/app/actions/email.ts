"use server";

import { prisma } from "@/lib/db/prisma";

export async function checkEmailExists(email: string) {
  try {
    const existingUser = await prisma.users.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    return { 
      success: true, 
      exists: !!existingUser 
    };
  } catch (error) {
    console.error("Error checking email:", error);
    return { 
      success: false, 
      error: "Failed to check email availability" 
    };
  }
}

export async function syncUserEmailWithCognito(
  cognito_sub: string,
  cognitoEmail: string,
  isEmailVerified: boolean
) {
  try {
    const user = await prisma.users.update({
      where: { cognito_sub },
      data: {
        email: cognitoEmail,
        status: isEmailVerified ? "active" : "pending_verification",
        email_verified_at: isEmailVerified ? new Date() : null,
      },
    });

    if (user) {
      await prisma.persons.updateMany({
        where: { user_id: user.id },
        data: {
          email: cognitoEmail,
        },
      });
    }

    return { success: true, user };
  } catch (error) {
    console.error("Error syncing email with Cognito:", error);
    return { success: false, error: "Failed to sync email with Cognito" };
  }
}

export async function updateUserEmailInDatabase(
  cognito_sub: string,
  newEmail: string
) {
  try {
    const user = await prisma.users.update({
      where: { cognito_sub },
      data: {
        email: newEmail,
        status: "active",
        email_verified_at: new Date(),
      },
    });

    if (user) {
      await prisma.persons.updateMany({
        where: { user_id: user.id },
        data: {
          email: newEmail,
        },
      });
    }

    return { success: true, user };
  } catch (error) {
    console.error("Error updating email in database:", error);
    return { success: false, error: "Failed to update email in database" };
  }
}
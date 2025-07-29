"use server";

import { prisma } from "@/lib/db/prisma";

export async function markEmailAsUnverified(
  cognito_sub: string,
  pendingEmail: string
) {
  try {
    const user = await prisma.users.update({
      where: { cognito_sub },
      data: {
        email: pendingEmail,
        status: "pending_verification",
        email_verified_at: null,
      },
    });

    if (user) {
      await prisma.persons.updateMany({
        where: { user_id: user.id },
        data: {
          email: pendingEmail,
        },
      });
    }

    return { success: true, user };
  } catch (error) {
    console.error("Error marking email as unverified:", error);
    return { success: false, error: "Failed to update email status" };
  }
}

export async function verifyUserEmail(cognito_sub: string) {
  try {
    const user = await prisma.users.update({
      where: { cognito_sub },
      data: {
        status: "active",
        email_verified_at: new Date(),
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Error verifying email:", error);
    return { success: false, error: "Failed to verify email" };
  }
}

export async function canStartApplication(cognito_sub: string) {
  try {
    const user = await prisma.users.findUnique({
      where: { cognito_sub },
      select: { status: true },
    });

    return {
      success: true,
      canStart: user?.status === "active",
    };
  } catch (error) {
    console.error("Error checking application eligibility:", error);
    return { success: false, error: "Failed to check eligibility" };
  }
}

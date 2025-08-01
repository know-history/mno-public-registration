"use server";

import { prisma } from "@/lib/db/prisma";

export async function checkEmailExists(email: string) {
  try {
    const existingUser = await prisma.users.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    return {
      success: true,
      exists: !!existingUser,
    };
  } catch (error) {
    console.error("Error checking email:", error);
    return {
      success: false,
      error: "Failed to check email availability",
    };
  }
}

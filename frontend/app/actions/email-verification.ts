"use server";

import { prisma } from "@/lib/db/prisma";

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

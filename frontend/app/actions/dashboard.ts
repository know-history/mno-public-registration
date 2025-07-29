"use server";

import { prisma } from "@/lib/db/prisma";

export async function getDashboardUserData(cognito_sub: string) {
  try {
    const user = await prisma.users.findUnique({
      where: { cognito_sub },
      include: {
        persons: {
          include: {
            gender_types: true,
          },
        },
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const person = user.persons[0] || null;

    return {
      success: true,
      data: {
        email: user.email,
        given_name: person?.first_name || "",
        family_name: person?.last_name || "",
        middle_name: person?.middle_name || "",
        user_role: "applicant",
        email_verified: user.status === "active",
        birth_date: person?.birth_date ? person.birth_date.toISOString().split('T')[0] : "",
        gender: person?.gender_types?.html_value_en || "",
        another_gender_value: person?.another_gender_value || "",
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard user data:", error);
    return { success: false, error: "Failed to fetch user data" };
  }
}
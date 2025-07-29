"use server";

import { prisma } from "@/lib/db/prisma";

export interface UpdateProfileData {
  first_name: string;
  last_name: string;
  middle_name?: string;
  birth_date?: string;
  gender_id?: number;
  another_gender_value?: string;
}

export async function updateProfile(
  cognito_sub: string,
  data: UpdateProfileData
) {
  try {
    const user = await prisma.users.findUnique({
      where: { cognito_sub },
      include: { persons: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    let sanitizedGenderValue = data.another_gender_value;
    if (sanitizedGenderValue) {
      sanitizedGenderValue = sanitizedGenderValue
        .trim()
        .replace(/[<>\"'%;()&+]/g, "")
        .substring(0, 100);
    }

    let person;
    if (user.persons.length > 0) {
      person = await prisma.persons.update({
        where: { id: user.persons[0].id },
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          middle_name: data.middle_name || null,
          birth_date: data.birth_date ? new Date(data.birth_date) : undefined,
          gender_id: data.gender_id,
          another_gender_value: sanitizedGenderValue || null,
        },
      });
    } else {
      person = await prisma.persons.create({
        data: {
          user_id: user.id,
          first_name: data.first_name,
          last_name: data.last_name,
          middle_name: data.middle_name || null,
          email: user.email,
          birth_date: data.birth_date ? new Date(data.birth_date) : null,
          gender_id: data.gender_id || 10,
          another_gender_value: sanitizedGenderValue || null,
        },
      });
    }

    return { success: true, person };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function getGenderTypes() {
  try {
    const genderTypes = await prisma.gender_types.findMany({
      orderBy: { id: "asc" },
    });

    return { success: true, data: genderTypes };
  } catch (error) {
    console.error("Error fetching gender types:", error);
    return { success: false, error: "Failed to fetch gender types" };
  }
}

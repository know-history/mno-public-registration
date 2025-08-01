"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export interface CreateUserData {
  cognito_sub: string;
  email: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  birth_date?: string;
  gender_id?: number;
}

export async function createUserWithPerson(data: CreateUserData) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.users.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new Error("User already exists");
      }

      const user = await tx.users.create({
        data: {
          cognito_sub: data.cognito_sub,
          email: data.email,
          status: "pending_verification",
        },
      });

      let person = null;
      if (data.first_name && data.last_name) {
        person = await tx.persons.create({
          data: {
            user_id: user.id,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            birth_date: data.birth_date ? new Date(data.birth_date) : null,
            gender_id: 10,
          },
        });
      }

      return { user, person };
    });

    revalidatePath("/dashboard");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    };
  }
}

export async function getUserWithPersonByCognitoSub(cognito_sub: string) {
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

    return {
      success: true,
      data: {
        user,
        person: user.persons[0] || null,
      },
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, error: "Failed to fetch user" };
  }
}

export async function updateUserEmailStatus(email: string, verified: boolean) {
  try {
    const user = await prisma.users.update({
      where: { email },
      data: {
        status: verified ? "active" : "pending_verification",
        email_verified_at: verified ? new Date() : null,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, user };
  } catch (error) {
    console.error("Error updating email status:", error);
    return { success: false, error: "Failed to update email status" };
  }
}

export async function updatePersonProfile(
  cognito_sub: string,
  personData: Partial<CreateUserData>
) {
  try {
    const user = await prisma.users.findUnique({
      where: { cognito_sub },
      include: { persons: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    let person;
    if (user.persons.length > 0) {
      person = await prisma.persons.update({
        where: { id: user.persons[0].id },
        data: {
          first_name: personData.first_name,
          last_name: personData.last_name,
          middle_name: personData.middle_name,
          birth_date: personData.birth_date
            ? new Date(personData.birth_date)
            : undefined,
          gender_id: personData.gender_id,
        },
      });
    } else {
      person = await prisma.persons.create({
        data: {
          user_id: user.id,
          first_name: personData.first_name!,
          last_name: personData.last_name!,
          middle_name: personData.middle_name,
          email: user.email,
          birth_date: personData.birth_date
            ? new Date(personData.birth_date)
            : null,
          gender_id: personData.gender_id,
        },
      });
    }

    revalidatePath("/dashboard");
    return { success: true, person };
  } catch (error) {
    console.error("Error updating person profile:", error);
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

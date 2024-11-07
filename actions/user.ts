"use server";

import { UserData } from "@/components/profilemodal";
import { db } from "@/lib/db";
import { Court } from "@prisma/client";

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    return user;
  } catch (error) {
    return null;
  }
}

export const getUserById = async (id?: string) => {
  if (!id) {
    return null;
  }

  try {
    const userFound = await db.user.findUnique({
      where: {
        id,
      },
    });

    return userFound;
  } catch (error) {
    return null;
  }
};

export const patchUser = async (values: UserData, fileUrl: string) => {
  try {
    const user = await db.user.update({
      where: { id: values.id },
      data: {
        name: values.name,
        email: values.email,
        lastname: values.lastname,
        phone: values.phone,
        image: fileUrl,
      },
    });
    return user;
  } catch (error) {
    return {
      error: "",
    };
  }
};

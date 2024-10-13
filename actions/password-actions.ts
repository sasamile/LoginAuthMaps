"use server";

// import { PasswordResetSchema } from "@/app/(auth)/password/page";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";
import { sendPasswordResetEmail } from "@/lib/brevo";
// import { z } from "zod";

export const PasswordActions = async ({ email }: { email: string }) => {
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  //envio de correo

  if (!user.passwordVerified) {
    const verificacionExist = await db.passwordResetToken.findFirst({
      where: {
        identifier: user.email,
        userId: user.id,
      },
    });

    if (verificacionExist?.userId) {
      await db.passwordResetToken.delete({
        where: {
          token: verificacionExist.token,
          userId: user.id,
        },
      });
    }

    const token = nanoid();

    await db.passwordResetToken.create({
      data: {
        identifier: user.email,
        userId: user.id,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    await sendPasswordResetEmail(user.email, token);
  }
  return user;
};

interface updateProps {
  password: string;
  email: string;
}

export const updatePHash = async ({ email, password }: updateProps) => {
try {
  console.log(email);
  console.log(password);

  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const passwordHas = await bcrypt.hash(password, 10);

  const updatePHash = await db.user.update({
    where: {
      email: email,
    },
    data: {
      password: passwordHas,
    },
  });

  return updatePHash
} catch (error) {
  console.log(error);
}
};

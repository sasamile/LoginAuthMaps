"use server";
import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { LoginSchema, RegisterSchema } from "@/lib/zod";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";


export const loginAction = async (values: z.infer<typeof LoginSchema>) => {
  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "Error 500" };
  }
};


export const RegisterAction = async (
  values: z.infer<typeof RegisterSchema>
) => {
  try {
    const { success, data } = RegisterSchema.safeParse(values);

    if (!success) return { error: "Invalid data" };

    const user = await db.user.findUnique({
      where: {
        email: values.email,
      },
    });

    if (user) return { error: "Email already exists" };

    const passwordHas = await bcrypt.hash(data.password, 10);

    //crear usuario

    await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: passwordHas,
        numeroTelefono: data.numeroTelefono,
        apellido: data.apellido,
        archivo: data.archivo,
        isAdmin: data.isAdmin,
        role: data.isAdmin ? "ADMIN" : "USER",
      },
    });

    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    {
      if (error instanceof AuthError) {
        return { error: error.cause?.err?.message };
      }
      return { error: "Error 500" };
    }
  }
};


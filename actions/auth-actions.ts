"use server";
import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { LoginSchema, RegisterSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { DeleteEmail, SendEmail } from "@/lib/brevo";
import { Role } from "@prisma/client";
import { getUserByEmail } from "./user";

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

export async function register(
  values: z.infer<typeof RegisterSchema>,
  role: Role,
  fileUrl?: string
) {
  const result = RegisterSchema.safeParse(values);

  if (result.error) {
    return { error: "Credenciales inválidos!" };
  }

  if (!role) {
    return { error: "Role requerido!" };
  }

  if (role === "ADMIN" && !fileUrl) {
    return {
      error: "RUT o documento que acredite propiedad del terreno requerido!",
    };
  }

  const { name, lastname, phone, email, password } = result.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "El correo ingresado ya está en uso!" };
    }

    await db.user.create({
      data: {
        name,
        lastname,
        phone,
        email,
        password: hashedPassword,
        role,
        isAdmin: role === "ADMIN",
        file: fileUrl,
        isActive: role === "USER",
      },
    });

    if (role === "USER") {
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
    }

    return { success: "Registro exitoso." };
  } catch (error) {
    return { error: "Algo salió mal en el proceso." };
  }
}

export const TotalUser = async () => {
  try {
    const totaluser = await db.user.findMany({
      where: {
        role: "ADMIN",
      },
    });
    return totaluser;
  } catch (error) {
    console.log(error);
  }
};

export const PendientesAdmin = async () => {
  try {
    const pendientes = await db.user.findMany({
      where: {
        role: "ADMIN",
        isActive: false,
      },
    });

    return pendientes;
  } catch (error) {
    console.log(error);
  }
};
export const AcceptedAdmin = async () => {
  try {
    const pendientes = await db.user.findMany({
      where: {
        role: "ADMIN",
        isActive: true,
      },
    });

    return pendientes;
  } catch (error) {
    console.log(error);
  }
};

export const AcceptAdmin = async (id: string) => {
  try {
    const Accept = await db.user.update({
      where: {
        id: id,
      },
      data: {
        isActive: true,
      },
    });
    await SendEmail(Accept.email, Accept.name);
    return Accept;
  } catch (error) {
    console.log(error);
  }
};
export const DeleteAdmin = async (id: string) => {
  try {
    const Accept = await db.user.delete({
      where: {
        id: id,
      },
    });
    await DeleteEmail(Accept.email, Accept.name);
    return Accept;
  } catch (error) {
    console.log(error);
  }
};

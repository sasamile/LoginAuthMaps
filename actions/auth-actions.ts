"use server";
import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { LoginSchema, RegisterSchema } from "@/lib/zod";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { DeleteEmail, SendEmail } from "@/lib/brevo";


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
export const TotalUser = async()=>{
  try {
    const totaluser = await db.user.findMany({
      where: {
        role: "ADMIN",
      },
    });
    return totaluser
  } catch (error) {
    console.log(error);
  }
}

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
    await SendEmail(Accept.email,Accept.name)
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
    await DeleteEmail(Accept.email,Accept.name)
    return Accept;
  } catch (error) {
    console.log(error);
  }
};

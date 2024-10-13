import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./lib/zod";
import { db } from "./lib/db";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { data, success, error } = LoginSchema.safeParse(credentials);

        if (!success) {
          throw new Error("Credenciales inválidas");
        }

        // Verificar si el usuario existe
        const user = await db.user.findUnique({
          where: {
            email: data.email,
          },
        });

        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        // Verificar la contraseña
        if (user.password) {
          const isValid = await bcrypt.compare(data.password, user.password);

          if (!isValid) {
            throw new Error("Contraseña inválida");
          }
        } else {
          // Caso donde user.password es nulo
          throw new Error("Contraseña no establecida");
        }

        // Si el rol es ADMIN, verificar si está activo
        if (user.role === "ADMIN") {
          if (!user.isActive) {
            throw new Error("Usuario no autorizado, cuenta inactiva");
          }
        }

        // Si es USER, permitir login sin verificar isActive
        if (
          user.role === "SUPERUSER" ||
          user.role === "USER" ||
          (user.role === "ADMIN" && user.isActive)
        ) {
          return user;
        }

        throw new Error("Usuario no autorizado");
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in", // Indica tu página personalizada
  },
} satisfies NextAuthConfig;

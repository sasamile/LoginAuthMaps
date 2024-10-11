import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./lib/zod";
import { db } from "./lib/db";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
// import { sendEmailVerification } from "./lib/mail";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    Credentials({
      authorize: async (credentials) => {
        const { data, success, error } = LoginSchema.safeParse(credentials);

        if (!success) {
          throw new Error("Invalid Credencials");
        }

        //verificar si existe el ususairo
        const user = await db.user.findUnique({
          where: {
            email: data.email,
          },
        });
        if (!user) {
          throw new Error("User not found");
        }

        if (user.password) {
          const isValid = await bcrypt.compare(data.password, user.password);

          if (!isValid) {
            throw new Error("Invalid Password");
          }
        } else {
          // Handle the case where user.password is null
          throw new Error("User password is null");
        }

        // //verificacion de Email
        // if (!user.emailVerified) {
        //   const verificacionExist = await db.verificationToken.findFirst({
        //     where: {
        //       identifier: user.email,
        //     },
        //   });
        //   if (verificacionExist?.identifier) {
        //     await db.verificationToken.delete({
        //       where: {
        //         identifier_token: {
        //           identifier: user.email,
        //           token: verificacionExist.token, // Use the token from verificacionExist
        //         },
        //       },
        //     });
        //   }

        //   const token = nanoid();

        //   await db.verificationToken.create({
        //     data: {
        //       identifier: user.email,
        //       token,
        //       expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        //     },
        //   });

        //   const response = await sendEmailVerification(user.email, token);

        //   //enviar email de verificacion
        //   throw new Error("Usuario no verificado");
        // }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in", // Indica tu página personalizada
  },
} satisfies NextAuthConfig;

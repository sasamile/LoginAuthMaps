import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? "USER"; // Valor por defecto si role es undefined
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) { // Verificar que token.id existe
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        
        // O alternativamente, con verificación de tipos más estricta:
        // session.user = {
        //   ...session.user,
        //   id: token.id,
        //   role: token.role ?? "USER"
        // };
      }
      return session;
    },
  },
});
import NextAuth from "next-auth";
import authConfig from "./auth.config";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.role = user.role;
        
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && typeof token.role === "string") {
        session.user.role = token.role;
        
      }
      return session;
    },
  },
});

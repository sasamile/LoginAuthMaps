import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // Cambiado de role?: string a role: string
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string; // Cambiado de role?: string a role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string; // Cambiado de role?: string a role: string
  }
}
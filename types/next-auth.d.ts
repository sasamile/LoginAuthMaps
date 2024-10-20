import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
  }

  declare module "next-auth/jwt" {
    interface JWT {
      role?: string;
    }
  }
}


export interface Cancha {
  id: string;
  name: string;
  address: string;
  description: string;
  dates: Date[];
  startTime: string;
  endTime: string;
  price: number;
  imageUrl: string;
  coordinates: JsonValue;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Reserva {
id: number;
canchaId: number;
fechaInicio: Date;
fechaFin: Date;
usuario: string;
}
import { fileURLToPath } from "url";
import { object, string, z } from "zod";

export const LoginSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(36, "Password must be less than 32 characters"),
});

export const RegisterSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(32, "Password must be less than 32 characters"),
  name: string({ required_error: "Name is required" }),
  apellido: string({ required_error: "Apellido is required" }),
  numeroTelefono: string({ required_error: "Número de teléfono es requerido" }),
  isAdmin: z.boolean().optional(), // Campo para verificar si el usuario es admin
  archivo: z
    .string()
    .optional()
    .refine((val) => val !== undefined, {
      message: "El archivo es requerido", // Mensaje de error si no se envía el documento
    }),
});

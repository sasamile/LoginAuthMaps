
import { object, string, z } from "zod";

export const LoginSchema = object({
  email: z
    .string()
    .email({ message: "Por favor ingresa un correo válido." })
    .trim(),
  password: z.string().min(1).trim(),
});

export const RegisterSchema = object({
  email: string({ required_error: "El correo es requerido." })
    .min(1, "El correo es requerido.")
    .email("Correo no válido."),
  password: z
    .string()
    .min(8, { message: "Debe tener al menos 8 caracteres" })
    .regex(/[a-zA-Z]/, { message: "Debe contener por lo menos 1 letra." })
    .regex(/[0-9]/, { message: "Debe contener al menos 1 numero." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Debe contener al menos 1 carácter especial.",
    })
    .trim(),
  name: string({ required_error: "El nombre es requerido." })
    .min(1, {
      message: "Debe contener menos un carácter.",
    })
    .trim(),
  lastname: string({ required_error: "El apellido es requerido." })
    .min(1, {
      message: "Debe contener menos un carácter.",
    })
    .trim(),
  phone: string({ required_error: "Número de teléfono es requerido" })
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message:
        "El número de teléfono debe ser válido y contener entre 7 y 15 dígitos.",
    })
    .trim(),
});


export const PasswordResetSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
});

export const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    description: z.string().min(10, {
      message: "La descripción debe tener al menos 10 caracteres.",
    }),
    dates: z.array(z.date(), {
      required_error: "Por favor seleccione al menos una fecha.",
    }),
    startTime: z.string({
      required_error: "Por favor seleccione una hora de inicio.",
    }),
    endTime: z.string({
      required_error: "Por favor seleccione una hora de fin.",
    }),
    price: z.string().refine((val) => !isNaN(Number(val)), {
      message: "El precio debe ser un número válido.",
    }),
    imageUrl: z.array(z.string().min(1, { message: "La imagen es obligatoria." })),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "La hora de fin debe ser posterior a la hora de inicio.",
    path: ["endTime"],
  });
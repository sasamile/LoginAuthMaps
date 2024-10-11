import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { date } from "zod";

export async function PATCH(
    request: Request,
    { params }: { params: { passwordemail: string } }
  ) {
    try {
      const { password, confirmPassword } = await request.json();
  
      // Verificar que se recibieron correctamente las contraseñas
      console.log("Contraseña nueva:", password);
      console.log("Confirmar contraseña:", confirmPassword);
  
      const user = await db.user.findUnique({
        where: {
          email: params.passwordemail,
        },
      });
  
      if (!user) {
        return new Response("Usuario no encontrado", { status: 404 });
      }
  
      if (password !== confirmPassword) {
        return new Response("Las contraseñas no coinciden", { status: 400 });
      }
  
      // Hashear la nueva contraseña
      const passwordHash = await bcrypt.hash(password, 10);
      console.log("Hash de la nueva contraseña:", passwordHash); // Log para ver el hash
  
      // Intentar actualizar la contraseña en la base de datos
      const updatedUser = await db.user.update({
        where: {
          email: params.passwordemail,
        },
        data: {
          password: passwordHash,
        },
      });
  
      console.log("Usuario actualizado:", updatedUser); // Log para verificar la actualización
      return NextResponse.json(updatedUser);
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      return new Response("Error interno del servidor", { status: 500 });
    }
  }
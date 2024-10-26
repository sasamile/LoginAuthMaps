"use server";
import { db } from "@/lib/db";
interface Coordinates {
  lat: number;
  lng: number;
}

interface CreateCourtInput {
  name: string;
  address: string;
  description: string;
  dates: Date[];
  startTime: string;
  endTime: string;
  price: number;
  imageUrl: string;
  coordinates: Coordinates; // Utilizamos un tipo más
  email: string;
}

export const canchasCourt = async (data: CreateCourtInput) => {
  const {
    name,
    address,
    description,
    dates,
    startTime,
    endTime,
    price,
    imageUrl,
    coordinates,
    email,
  } = data;

  console.log(data);

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("El usuario con el ID proporcionado no existe.");
  }

  // Verificar si el usuario es admin
  if (user.role !== "ADMIN") {
    throw new Error(
      "No tienes permisos para realizar esta acción. Solo los administradores pueden crear canchas."
    );
  }

  // Si el usuario es admin, proceder con la lógica de creación
  try {
    console.log(data);
    // Crear la cancha en la base de datos (ejemplo usando Prisma)
    const newCourt = await db.court.create({
      data: {
        name,
        address,
        description,
        dates,
        startTime,
        endTime,
        price,
        imageUrl,
        coordinates: JSON.stringify(coordinates),
        userId: user.id,
      },
    });

    return newCourt;
  } catch (error) {
    throw new Error(`Error al crear la cancha: ${error}`);
  }
};

export const getListBack = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user?.role !== "ADMIN") {
      throw new Error("Error el usuario no es Admin");
    }

    const court = await db.court.findMany({
      where: {
        userId: user.id,
      },
    });
    return court;
  } catch (error) {
    console.log(error);
  }
};

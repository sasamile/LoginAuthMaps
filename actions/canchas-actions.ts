"use server";
import { db } from "@/lib/db";
import { getUserByEmail } from "./user";
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
  imageUrl: string[];
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

  const user = await getUserByEmail(email);

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
    const user = await getUserByEmail(email);

    if (!user) {
      throw new Error("El usuario con el ID proporcionado no existe.");
    }

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

export const fetchCourts = async () => {
  try {
    const courts = await db.court.findMany();
    return courts;
  } catch (error) {
    console.error("Error fetching courts:", error);
    throw new Error("Failed to fetch courts");
  }
};

export const firstCourts = async (id: string) => {
  try {
    const courts = await db.court.findFirst({
      where: {
        id: id,
      },
    });
    return courts;
  } catch (error) {
    console.error("Error fetching courts:", error);
    throw new Error("Failed to fetch courts");
  }
};

export const getCourtAllID = async (id: string) => {
  try {
    const Courtid = await db.court.findFirst({
      where: {
        id: id,
      },
    });
    return Courtid;
  } catch (error) {
    throw new Error("Failed to fetch courts");
  }
};

//filtrado de canchas y reservas

export const getListCourtReservas = async (email: string) => {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      throw new Error("El usuario con el ID proporcionado no existe.");
    }

    if (user?.role !== "ADMIN") {
      throw new Error("Error el usuario no es Admin");
    }

    const court = await db.court.findMany({
      where: {
        userId: user.id,
      },
      include: {
        Reservation: true,
        user: true,
      },
    });
    return court;
  } catch (error) {
    console.log(error);
  }
};

export async function deleteCourt(courtId: string) {
  try {
    await db.court.delete({
      where: { id: courtId },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting court:", error);
    return { success: false, error: "Failed to delete court" };
  }
}

// export async function updateCourt(court: any) {
//   try {
//     const updatedCourt = await db.court.update({
//       where: { id: court.id },
//       data: {
//         name: court.name,
//         address: court.address,
//         description: court.description,
//         dates: court.dates,
//         startTime: court.startTime,
//         endTime: court.endTime,
//         price: court.price,
//         imageUrl: court.imageUrl,
//         coordinates: JSON.stringify(court.coordinates),
//       },
//     });
//     return { success: true, court: updatedCourt };
//   } catch (error) {
//     console.error("Error updating court:", error);
//     return { success: false, error: "Failed to update court" };
//   }
// }


export async function updateCourt(data: {
  id: string;
  name: string;
  address: string;
  description: string;
  dates: Date[];
  startTime: string;
  endTime: string;
  imageUrl: string[];
  coordinates: {
    lat: number;
    lng: number;
  } | string; // Allow for both parsed and string coordinates
  price: number;
  email: string;
}) {
  try {
    // Ensure coordinates are stored as a string in the database
    const coordinatesString = typeof data.coordinates === 'string' 
      ? data.coordinates 
      : JSON.stringify(data.coordinates);

    await db.court.update({
      where: { 
        id: data.id,
        // Optionally verify ownership
        // userEmail: data.email 
      },
      data: {
        name: data.name,
        address: data.address,
        description: data.description,
        dates: data.dates,
        startTime: data.startTime,
        endTime: data.endTime,
        imageUrl: data.imageUrl,
        coordinates: coordinatesString,
        price: data.price,
      },
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating court:", error);
    return { success: false, error: "Error al actualizar la cancha" };
  }
}
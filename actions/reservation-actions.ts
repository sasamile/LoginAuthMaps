// actions/reservation-actions.ts
"use server";

import { db } from "@/lib/db";
import { ReservationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getUserByEmail } from "./user";

interface CreateReservationParams {
  courtId: string;
  email: string;
  date: Date;
  startTime: string;
  endTime: string;
  totalHours: number;
  totalPrice: number;
}

export async function createReservation(data: CreateReservationParams) {
  console.log("Server Action Called with data:", data); // Debug log

  try {
    const user = await getUserByEmail(data.email);

    if (!user) {
      throw new Error("Error el usuario no registrado");
    }

    // Verificar si ya existe una reserva para esa fecha y hora
    const existingReservation = await db.reservation.findFirst({
      where: {
        courtId: data.courtId,
        date: data.date,
        AND: [
          {
            startTime: {
              lte: data.endTime,
            },
          },
          {
            endTime: {
              gte: data.startTime,
            },
          },
        ],
        status: {
          in: [ReservationStatus.PENDING, ReservationStatus.SUCCESS],
        },
      },
    });

    if (existingReservation) {
      console.log("Existing reservation found:", existingReservation); // Debug log
      return {
        error: "Este horario ya está reservado",
      };
    }

    const reservation = await db.reservation.create({
      data: {
        courtId: data.courtId,
        userId: user.id,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        totalHours: data.totalHours,
        totalPrice: data.totalPrice,
        status: ReservationStatus.PENDING,
      },
    });

    console.log("Reservation created:", reservation); // Debug log

    revalidatePath(`/courts/${data.courtId}`);

    return { success: true, data: reservation };
  } catch (error) {
    console.error("[RESERVATION_ERROR]", error);
    return {
      error: "Error al crear la reserva",
    };
  }
}

export async function checkCourtAvailability(
  courtId: string,
  date: Date,
  startTime: string,
  endTime: string
) {
  try {
    const existingReservation = await db.reservation.findFirst({
      where: {
        courtId,
        date,
        status: { not: ReservationStatus.DENIED },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
        ],
      },
    });

    return { available: !existingReservation };
  } catch (error) {
    console.error("Error al verificar la disponibilidad de la cancha:", error);
    return {
      error:
        "No se pudo verificar la disponibilidad. Por favor, inténtalo de nuevo.",
    };
  }
}

export async function getreservas(email: string) {
  console.log(email);
  const user = await getUserByEmail(email);

  if (!user) {
    console.log("Error el usuario no registrado");
    return []; // Return an empty array or handle the error as needed
  }

  try {
    const res = await db.reservation.findMany({
      where: {
        userId: user.id,
        status: "PENDING",
      },
      include: { court: true },
    });
    return res;
  } catch (error) {
    return {
      error:
        "No se pudo verificar la disponibilidad. Por favor, inténtalo de nuevo.",
    };
  }
}

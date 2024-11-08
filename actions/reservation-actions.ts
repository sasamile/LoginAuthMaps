// actions/reservation-actions.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getUserByEmail } from "./user";
import { auth } from "@/auth";
import { ReservationStatus } from "@prisma/client";
import { LinkEmailPage } from "@/lib/brevo";

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

export async function getreservassucces(email: string) {
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
        status: {
          in: ["SUCCESS", "DENIED"],
        },
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

export async function getFilteredReservations(filters: {
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: ReservationStatus;
  reference?: string;
  courtName?: string;
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const { date, startTime, endTime, status, reference, courtName } = filters;

  // Create the date range filter
  let dateFilter = {};
  if (date) {
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    dateFilter = {
      date: {
        gte: startDate,
        lt: endDate,
      },
    };
  }

  const reservations = await db.reservation.findMany({
    where: {
      ...dateFilter,
      ...(startTime && { startTime }),
      ...(endTime && { endTime }),
      ...(status && { status }),
      ...(reference && { referencia: { contains: reference } }),
      ...(courtName && { court: { name: { contains: courtName } } }),
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      court: {
        select: {
          name: true,
        },
      },
    },
  });

  return reservations;
}
export async function updateReservationStatus(
  reservationId: string,
  status: ReservationStatus,
  paymentLink?: string,
  referencia?: string
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const updatedReservation = await db.reservation.update({
    where: { id: reservationId },
    data: {
      status,
      ...(paymentLink && { linkPago: paymentLink }),
      ...(referencia && { referencia: referencia }),
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
      court: {
        select: {
          name: true,
        },
      },
    },
  });

  // Enviar correo al usuario con el link de pago
  try {
    await LinkEmailPage(updatedReservation.user.email, paymentLink);
    console.log("Email sent successfully to:", updatedReservation.user.email); // Agregar registro de éxito
  } catch (error) {
    console.error("Failed to send email:", error); // Agregar registro de error
  }

  // Programar la verificación de pago
  schedulePaymentCheck(
    updatedReservation.id,
    updatedReservation.date,
    updatedReservation.startTime
  );

  return updatedReservation;
}

async function schedulePaymentCheck(
  reservationId: string,
  reservationDate: Date,
  startTime: string
) {
  const reservationDateTime = new Date(
    `${reservationDate.toISOString().split("T")[0]}T${startTime}`
  );
  const checkTime = new Date(
    reservationDateTime.getTime() - 2 * 60 * 60 * 1000
  ); // 2 horas antes

  setTimeout(async () => {
    const reservation = await db.reservation.findUnique({
      where: { id: reservationId },
      select: { status: true, linkPago: true },
    });

    if (
      reservation &&
      reservation.status === ReservationStatus.PENDING &&
      !reservation.linkPago
    ) {
      await deleteReservation(reservationId);
      console.log(`Reservation ${reservationId} deleted due to no payment.`);
    }
  }, checkTime.getTime() - Date.now());
}

export async function addPaymentLink(
  reservationId: string,
  paymentLink: string
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const updatedReservation = await db.reservation.update({
    where: { id: reservationId },
    data: {
      linkPago: paymentLink,
    },
    include: {
      user: {
        select: {
          email: true, // Asegurarse de incluir el email en la respuesta
        },
      },
    },
  });

  // Enviar correo al usuario con el link de pago
  try {
    await LinkEmailPage(updatedReservation.user.email, paymentLink); // Pasar el email y el link de pago
    console.log("Email sent successfully to:", updatedReservation.user.email); // Registro de éxito
  } catch (error) {
    console.error("Failed to send email:", error); // Registro de error
  }

  return updatedReservation;
}
export async function addReferenciaLink(
  reservationId: string,
  referencia: string
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const updatedReservation = await db.reservation.update({
    where: { id: reservationId },
    data: {
      referencia,
    },
  });

  return updatedReservation;
}

export async function deleteReservation(reservationId: string) {
  try {
    await db.reservation.delete({
      where: { id: reservationId },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete reservation:", error);
    return { success: false, error: "Failed to delete reservation" };
  }
}

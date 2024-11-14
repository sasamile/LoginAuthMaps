"use server";

import { db } from "@/lib/db";

export async function getReportData(
  reportType: string,
  month: string,
  day: string,
  year: string
) {
  const selectedDate = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day)
  );

  if (reportType === "bookings") {
    const reservations = await db.reservation.findMany({
      where: {
        date: selectedDate,
      },
      include: {
        court: true,
        user: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });
    return reservations;
  }

  if (reportType === "income") {
    const reservations = await db.reservation.findMany({
      where: {
        date: selectedDate,
        status: "SUCCESS",
      },
      include: {
        court: true,
        user: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    const totalIncome = reservations.reduce(
      (acc, res) => acc + res.totalPrice,
      0
    );

    return {
      reservations,
      summary: { totalIncome },
    };
  }

  if (reportType === "occupancy") {
    const courts = await db.court.findMany();
    const reservations = await db.reservation.findMany({
      where: {
        date: selectedDate,
      },
      include: {
        court: true,
      },
    });

    return courts.map((court) => {
      const courtReservations = reservations.filter(
        (r) => r.courtId === court.id
      );
      const totalHours = courtReservations.reduce(
        (acc, r) => acc + r.totalHours,
        0
      );
      const occupancyRate = (totalHours / 24) * 100; // Asumiendo 24 horas disponibles

      return {
        courtName: court.name,
        reservations: courtReservations.length,
        occupancyRate,
      };
    });
  }
}

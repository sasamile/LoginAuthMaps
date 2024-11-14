"use server";

import { db } from "@/lib/db";

export async function getReportData(
  reportType: string,
  month: string,
  year: string,
  userId: string
) {
  // Crear fechas de inicio y fin del mes
  const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
  const endDate = new Date(parseInt(year), parseInt(month), 0); // Último día del mes

  if (reportType === "bookings") {
    const reservations = await db.reservation.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        status: "SUCCESS",
        court: {
          userId: userId
        }
      },
      include: {
        court: true,
        user: true,
      },
      orderBy: {
        date: "asc",
      },
    });
    return reservations;
  }

  if (reportType === "income") {
    const reservations = await db.reservation.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        status: "SUCCESS",
        court: {
          userId: userId
        }
      },
      include: {
        court: true,
        user: true,
      },
      orderBy: {
        date: "asc",
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
    const courts = await db.court.findMany({
      where: {
        userId: userId
      }
    });
    
    const reservations = await db.reservation.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        status: "SUCCESS",
        court: {
          userId: userId
        }
      },
      include: {
        court: true,
      },
    });

    const daysInMonth = endDate.getDate();
    const totalHoursInMonth = daysInMonth * 24; // Total de horas disponibles en el mes

    return courts.map((court) => {
      const courtReservations = reservations.filter(
        (r) => r.courtId === court.id
      );
      const totalHours = courtReservations.reduce(
        (acc, r) => acc + r.totalHours,
        0
      );
      const occupancyRate = (totalHours / totalHoursInMonth) * 100;

      return {
        courtName: court.name,
        reservations: courtReservations.length,
        occupancyRate,
      };
    });
  }
}
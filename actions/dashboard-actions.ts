"use server";

import { db } from "@/lib/db";
import { ReservationStatus } from "@prisma/client";
import { getUserByEmail } from "./user";

export async function getDashboardData(email: string) {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      throw new Error("El usuario con el email proporcionado no existe.");
    }

    // Obtener todas las reservas (incluyendo PENDING y SUCCESS)
    const totalReservations = await db.reservation.count({
      where: {
        court: {
          userId: user.id,
        },
      },
    });

    // Calcular ingresos solo de reservas exitosas
    const totalIncome = await db.reservation.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: {
        court: {
          userId: user.id,
        },
        status: ReservationStatus.SUCCESS,
      },
    });

    const totalCourts = await db.court.count({
      where: {
        userId: user.id,
      },
    });

    const occupancyRate = await calculateOccupancyRate(user.id);
    const monthlyData = await getMonthlyData(user.id);
    const recentBookings = await getRecentBookings(user.id);

    const reservationDetails = await db.reservation.findMany({
      where: {
        court: {
          userId: user.id,
        },
        status: ReservationStatus.SUCCESS,
      },
      select: {
        id: true,
        totalPrice: true,
        startTime: true,
        endTime: true,
        court: {
          select: {
            name: true,
            price: true,
          }
        }
      }
    });

    return {
      totalReservations,
      totalIncome: totalIncome._sum.totalPrice || 0,
      totalCourts,
      occupancyRate,
      monthlyData,
      recentBookings,
      debug: reservationDetails,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }
}

async function getRecentBookings(userId: string) {
  return db.reservation.findMany({
    where: {
      court: {
        userId: userId,
      },
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
    orderBy: {
      createdAt: "desc",
    },
    take: 10, // Aumentamos el límite para mostrar más reservas recientes
  });
}

async function getMonthlyData(userId: string) {
  const currentYear = new Date().getFullYear();
  const monthlyData = await db.reservation.groupBy({
    by: ["date"],
    _sum: {
      totalPrice: true,
    },
    where: {
      court: {
        userId: userId,
      },
      status: ReservationStatus.SUCCESS,
      date: {
        gte: new Date(currentYear, 0, 1),
        lt: new Date(currentYear + 1, 0, 1),
      },
    },
  });

  // Inicializar array con 12 meses
  const monthlyTotals = Array(12).fill(0);

  // Sumar los totales por mes
  monthlyData.forEach((data) => {
    const month = new Date(data.date).getMonth();
    monthlyTotals[month] += data._sum.totalPrice || 0;
  });

  return monthlyTotals.map((total, index) => ({
    name: new Date(currentYear, index).toLocaleString("default", {
      month: "short",
    }),
    total: Math.round(total),
  }));
}

async function calculateOccupancyRate(userId: string) {
  const currentMonth = new Date();
  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );

  const totalReservations = await db.reservation.count({
    where: {
      court: {
        userId: userId,
      },
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  const totalCourts = await db.court.count({
    where: {
      userId: userId,
    },
  });

  // Assuming each court can have 1 reservation per day
  const daysInMonth = endOfMonth.getDate();
  const maxPossibleReservations = totalCourts * daysInMonth;

  return maxPossibleReservations > 0
    ? Math.round((totalReservations / maxPossibleReservations) * 100)
    : 0;
}

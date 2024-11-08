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

    const totalReservations = await db.reservation.count({
      where: {
        court: {
          userId: user.id,
        },
      },
    });

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

    return {
      totalReservations,
      totalIncome: totalIncome._sum.totalPrice || 0,
      totalCourts,
      occupancyRate,
      monthlyData,
      recentBookings,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }
}

async function calculateOccupancyRate(userId: string) {
    const totalSlots = await db.court.count({
      where: {
        userId: userId,
      },
    });
  
    const bookedSlots = await db.reservation.count({
      where: {
        status: ReservationStatus.SUCCESS,
        court: {
          userId: userId,
        },
      },
    });
  
    if (totalSlots > 0) {
      return Math.round((bookedSlots / totalSlots) * 100);
    }
    return 0;
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

  const monthlyTotals = Array(12).fill(0);
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

async function getRecentBookings(userId: string) {
  return db.reservation.findMany({
    where: {
      court: {
        userId: userId,
      },
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
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
}
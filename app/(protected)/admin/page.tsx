"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentBookings } from "./_components/recent-bookings";
import { Overview } from "./_components/overview";
import { getDashboardData } from "@/actions/dashboard-actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState<any>({
    totalReservations: 0,
    totalIncome: 0,
    totalCourts: 0,
    occupancyRate: 0,
    monthlyData: [],
    recentBookings: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    } else if (status === "authenticated" && session?.user?.email) {
      fetchDashboardData(session.user.email);
    }
  }, [status, session, router]);

  async function fetchDashboardData(email: string) {
    try {
      const data = await getDashboardData(email);
      setDashboardData(data);
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Panel de Control
        </h2>
      </div>

      <div className="space-y-4 mt-4">
        {/* Cards de estadísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reservas Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl md:text-2xl font-bold">
                {dashboardData.totalReservations}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl md:text-2xl font-bold">
                ${dashboardData.totalIncome.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Canchas Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl md:text-2xl font-bold">
                {dashboardData.totalCourts}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tasa de Ocupación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl md:text-2xl font-bold">
                {dashboardData.occupancyRate}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos y Reservas Recientes */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          <Card className="col-span-1 md:col-span-4">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Resumen Mensual
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={dashboardData.monthlyData} />
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Reservas Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecentBookings bookings={dashboardData.recentBookings} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
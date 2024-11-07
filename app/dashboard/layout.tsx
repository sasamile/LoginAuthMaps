"use client";
import NavButton from "@/components/dashboard/navbutton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Estado para controlar la carga
  useEffect(() => {
    if (status === "loading") return; // Esperar a que la sesión se cargue

    if (!session) {
      // Si no hay sesión, redirigir a la página de inicio de sesión
      router.push("/sign-in");
    } else if (session.user.role === "ADMIN") {
      // Redirigir a dashboard si el rol es USER
      router.push("/admin");
    } else if (session.user.role === "SUPERUSER") {
      // Redirigir a superadmin-dashboard si el rol es SUPERADMIN
      router.push("/superadmin");
    } else if (session.user.role !== "USER") {
      // Si no es ADMIN, redirigir a una página de acceso denegado o similar
      router.push("/access-denied");
    } else {
      setLoading(false); // Si es ADMIN, no está cargando
    }
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Cargando...</div>
      </div>
    ); // Mostrar un loader mientras se verifica la sesión
  }
  return (
    <div>
      <NavButton />
      {children}
    </div>
  );
}

export default DashboardLayout;

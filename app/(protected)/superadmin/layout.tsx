"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/providers/theme-provider";
import NavbarSuper from "@/components/NavbarSuper";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Estado para controlar la carga

  useEffect(() => {
    if (status === "loading") return; // Esperar a que la sesión se cargue

    if (!session) {
      // Si no hay sesión, redirigir a la página de inicio de sesión
      router.push("/sign-in");
    } else {
      // Redirigir según el rol del usuario
      switch (session.user.role) {
        case "USER":
          router.push("/dashboard");
          break;
        case "SUPERUSER":
          router.push("/superadmin");
          break;
        case "ADMIN":
          router.push("/admin"); // Redirigir a la página de ADMIN
          break;
        default:
          router.push("/access-denied"); // Si no es un rol reconocido, redirigir a acceso denegado
      }
    }
    setLoading(false); // Si se ha redirigido, no está cargando
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Cargando...</div>
      </div>
    ); // Mostrar un loader mientras se verifica la sesión
  }
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavbarSuper />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { MainNav } from "./_components/main-nav";
import { UserNav } from "./_components/user-nav";
import { ModeToggle } from "@/components/ui/modetoggle";
import { useRouter } from "next/navigation";

function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Estado para controlar la carga

  useEffect(() => {
    if (status === "loading") return; // Esperar a que la sesión se cargue

    if (!session) {
      // Si no hay sesión, redirigir a la página de inicio de sesión
      router.push("/sign-in");
    } else if (session.user.role === "USER") {
      // Redirigir a dashboard si el rol es USER
      router.push("/dashboard");
    } else if (session.user.role === "SUPERUSER") {
      // Redirigir a superadmin-dashboard si el rol es SUPERADMIN
      router.push("/superadmin");
    } else if (session.user.role !== "ADMIN") {
      // Si no es ADMIN, redirigir a una página de acceso denegado o similar
      router.push("/access-denied");
    } else {
      setLoading(false); // Si es ADMIN, no está cargando
    }
  }, [session, status, router]);

  // Si la sesión está cargando, puedes mostrar un loader o similar
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Cargando...</div>{" "}
        {/* Solo estilo y texto */}
      </div>
    ); // Mostrar un loader mientras se verifica la sesión
  }

  return (
    <div className="flex-col flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default Layout;

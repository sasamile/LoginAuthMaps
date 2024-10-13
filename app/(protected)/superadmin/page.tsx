"use client";
import {
  AcceptedAdmin,
  PendientesAdmin,
  TotalUser,
} from "@/actions/auth-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  type User = {
    id: string;
    name: string;
    email: string;
    pdfUrl: string | null;
  };

  const [usersA, setUsersA] = useState<User[]>([]);
  const [usersT, setUsersT] = useState<User[]>([]);
  const [usersP, setUsersP] = useState<User[]>([]);
  const [loading, setLoading] = useState(true); // Estado de carga

  const handleData = async () => {
    try {
      setLoading(true); // Iniciar carga
      const [responseP, responseT, responseA] = await Promise.all([
        PendientesAdmin(),
        TotalUser(),
        AcceptedAdmin(),
      ]);

      if (responseP) {
        setUsersP(
          responseP.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            pdfUrl: user.archivo,
          }))
        );
      }

      if (responseT) {
        setUsersT(
          responseT.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            pdfUrl: user.archivo,
          }))
        );
      }

      if (responseA) {
        setUsersA(
          responseA.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            pdfUrl: user.archivo,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false); // Finalizar carga
    }
  };

  useEffect(() => {
    handleData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      {loading ? ( // Renderizado condicional basado en el estado de carga
        <p>Cargando datos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersT.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Aceptados</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersA.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Pendientes</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersP.length}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

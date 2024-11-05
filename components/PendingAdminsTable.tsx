"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AcceptAdmin, DeleteAdmin, PendientesAdmin } from "@/actions/auth-actions";
import toast from "react-hot-toast";

type User = {
  id: string;
  name: string;
  email: string;
  pdfUrl: string | null;
};

export function PendingAdminsTable() {
  const [users, setUsers] = useState<User[]>([]);

  const handleData = async () => {
    const response = await PendientesAdmin();
    if (response) {
      setUsers(
        response.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          pdfUrl: user.file,
        }))
      );
    }
  };

  useEffect(() => {
    handleData();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await AcceptAdmin(id);
      toast.success("Usuario Autorizado con Éxito");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await DeleteAdmin(id);
      toast.success("Usuario Rechazado con Éxito");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>PDF</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium uppercase">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {user.pdfUrl ? (
                <a
                  href={user.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Ver PDF
                </a>
              ) : (
                "No disponible"
              )}
            </TableCell>
            <TableCell className="text-right">
              {/* Asegúrate de que los botones no estén anidados */}
              <div>
                <Button onClick={() => handleAccept(user.id)} className="mr-2">
                  Aceptar
                </Button>
                <Button onClick={() => handleReject(user.id)} variant="destructive">
                  Rechazar
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

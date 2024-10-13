"use client"

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AcceptedAdmin } from '@/actions/auth-actions';

type User = {
  id: string;
  name: string;
  email: string;
  pdfUrl: string | null;
};
export function AcceptedAdminsTable() {
  const [users, setUsers] = useState<User[]>([]);

  const handleData = async () => {
    const response = await AcceptedAdmin();
    if (response) {
      setUsers(
        response.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          pdfUrl: user.archivo,
        }))
      );
    }
  };

  useEffect(() => {
    handleData();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>PDF</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {user.pdfUrl ? (
                <a href={user.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Ver PDF
                </a>
              ) : (
                "No disponible"
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
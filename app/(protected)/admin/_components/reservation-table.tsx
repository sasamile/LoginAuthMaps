"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ReservationStatus } from "@prisma/client";
import {
  addPaymentLink,
  addReferenciaLink,
  getFilteredReservations,
  updateReservationStatus,
  deleteReservation,
} from "@/actions/reservation-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function ReservationTable() {
  const router = useRouter()
  const { data: session } = useSession();
  const [reservations, setReservations] = useState<
    {
      user: { email: string; name: string };
      court: { name: string; price: number };
      date: Date;
      startTime: string;
      endTime: string;
      status: ReservationStatus;
      id: string;
      courtId: string;
      referencia: string | null;
      linkPago: string | null;
      updatedAt: Date;
    }[]
  >([]);
  const [filters, setFilters] = useState<{
    date: string;
    startTime: string;
    endTime: string;
    status: ReservationStatus | undefined;
    reference: string;
  }>({
    date: "",
    startTime: "",
    endTime: "",
    status: undefined,
    reference: "",
  });

  useEffect(() => {
    fetchReservations();
  }, [filters]);

  const fetchReservations = async () => {
    try {
      const filteredReservations = await getFilteredReservations(
        filters,
        session?.user.email ?? ""
      );
      setReservations(filteredReservations);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleStatusUpdate = async (
    reservationId: string,
    status: ReservationStatus
  ) => {
    try {
      await updateReservationStatus(reservationId, status);
      fetchReservations();
    } catch (error) {
      console.error("Failed to update reservation status:", error);
    }
  };

  const handleAddPaymentLink = async (
    reservationId: string,
    paymentLink: string
  ) => {
    try {
      await addPaymentLink(reservationId, paymentLink);
      fetchReservations();
    } catch (error) {
      console.error("Failed to add payment link:", error);
    }
  };

  const handleAddReference = async (
    reservationId: string,
    referencia: string
  ) => {
    try {
      await addReferenciaLink(reservationId, referencia);
      fetchReservations();
    } catch (error) {
      console.error("Failed to add reference:", error);
    }
  };

  const handleDeleteReservation = async (reservationId: string) => {
    try {
      await deleteReservation(reservationId);
      fetchReservations();
    } catch (error) {
      console.error("Failed to delete reservation:", error);
    }
  };

  const generatePaymentLinks = async () => {
    // Implement the logic to generate payment links for all reservations
    router.push("")
  };

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      case "SUCCESS":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Success
          </Badge>
        );
      case "DENIED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Denied
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!session || session.user.role !== "ADMIN") {
    return <div>Access Denied</div>;
  }

  const calculateDurationInHours = (startTime: string, endTime: string) => {
    const start = new Date(`1970-01-01T${startTime}:00Z`);
    const end = new Date(`1970-01-01T${endTime}:00Z`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Reservations</CardTitle>
        <Button onClick={generatePaymentLinks}>Generate Payment Links</Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="w-full"
          />
          <Input
            type="time"
            name="startTime"
            value={filters.startTime}
            onChange={handleFilterChange}
            className="w-full"
          />
          <Select
            name="status"
            value={filters.status}
            onValueChange={(value) =>
              setFilters({ ...filters, status: value as ReservationStatus })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="DENIED">Denied</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            name="reference"
            value={filters.reference}
            onChange={handleFilterChange}
            placeholder="Reference"
            className="w-full"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Court</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Payment Link</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>
                  {new Date(reservation.date).toISOString().split("T")[0]}
                </TableCell>
                <TableCell>{`${reservation.startTime} - ${reservation.endTime}`}</TableCell>
                <TableCell>{reservation.user.name}</TableCell>
                <TableCell>{reservation.court.name}</TableCell>
                <TableCell>
                  {reservation.court.price *
                    calculateDurationInHours(
                      reservation.startTime,
                      reservation.endTime
                    )}
                </TableCell>
                <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                <TableCell>
                  <Input
                    type="text"
                    placeholder="Reference"
                    defaultValue={reservation.referencia || ""}
                    onBlur={(e) =>
                      handleAddReference(reservation.id, e.target.value)
                    }
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    placeholder="Payment Link"
                    defaultValue={reservation.linkPago || ""}
                    onBlur={(e) =>
                      handleAddPaymentLink(reservation.id, e.target.value)
                    }
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={reservation.status}
                      onValueChange={(value) =>
                        handleStatusUpdate(
                          reservation.id,
                          value as ReservationStatus
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="SUCCESS">Success</SelectItem>
                        <SelectItem value="DENIED">Denied</SelectItem>
                      </SelectContent>
                    </Select>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleDeleteReservation(reservation.id)
                          }
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

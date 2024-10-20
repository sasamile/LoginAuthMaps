import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockBookings = [
  {
    id: "1",
    courtName: "Cancha Principal",
    userName: "Juan Pérez",
    startTime: "2023-05-15T14:00:00",
    endTime: "2023-05-15T15:00:00",
    status: "CONFIRMED",
    isPaid: true,
  },
  {
    id: "2",
    courtName: "Cancha Auxiliar",
    userName: "María García",
    startTime: "2023-05-16T16:00:00",
    endTime: "2023-05-16T17:00:00",
    status: "PENDING",
    isPaid: false,
  },
  // Agrega más reservas de ejemplo aquí
];

export function BookingList() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cancha</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Fecha y Hora</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Pago</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockBookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>{booking.courtName}</TableCell>
            <TableCell>{booking.userName}</TableCell>
            <TableCell>
              {new Date(booking.startTime).toLocaleString()} -{" "}
              {new Date(booking.endTime).toLocaleTimeString()}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  booking.status === "CONFIRMED" ? "default" : "secondary"
                }
              >
                {booking.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={booking.isPaid ? "default" : "destructive"}>
                {booking.isPaid ? "Pagado" : "Pendiente"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

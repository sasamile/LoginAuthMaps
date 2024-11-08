"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CreditCardIcon,
  XIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { oswald } from "@/lib/font";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

export interface Court {
  id: string;
  name: string;
  address: string;
  description: string;
  dates: Date[];
  startTime: string;
  endTime: string;
  price: number;
  imageUrl: string[];
  coordinates: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reservation {
  id: string;
  courtId: string;
  userId: string;
  date: Date;
  startTime: string;
  endTime: string;
  totalHours: number;
  totalPrice: number;
  status: string;
  linkPago: string | null;
  createdAt: Date;
  updatedAt: Date;
  court: Court;
}

interface CourtListReserveProps {
  reservas?: Reservation[];
}

export default function CourtListReserve({ reservas }: CourtListReserveProps) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  function truncateDescription(description: string, wordLimit: number) {
    const words = description.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : description;
  }

  function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <div className="max-w-7xl space-y-8 mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
        {pathname === "/dashboard/history" ? (
          <>Historial de Reservas</>
        ) : (
          <>Tus Reservas</>
        )}
      </h2>

      {!reservas || reservas.length === 0 ? (
        <div className="text-center">
          <div className="flex justify-center items-center flex-col">
            <div>
              <Image
                src={
                  theme === "dark"
                    ? "/ampty-alerts-white.svg"
                    : "/ampty-alerts-black.svg"
                }
                alt="Iconsvg"
                width={500}
                height={500}
              />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No se encontraron reservas.
            </p>
          </div>
        </div>
      ) : (
        <div className="shadow overflow-hidden sm:rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">Cancha</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservas.map((reserva) => (
                <TableRow
                  key={reserva.id}
                  className="hover:bg-gray-50 dark:hover:bg-muted/50 transition-colors"
                >
                  <TableCell
                    className={`${oswald.className} font-medium uppercase`}
                  >
                    {reserva.court.name}
                  </TableCell>
                  <TableCell>
                    {new Date(reserva.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{`${reserva.startTime} - ${reserva.endTime}`}</TableCell>
                  <TableCell>${reserva.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full ",
                        getStatusColor(reserva.status),
                        reserva.status === "SUCCESS"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      )}
                    >
                      {reserva.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedReservation(reserva)}
                        >
                          Ver detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                          <DialogTitle>Detalles de la Reserva</DialogTitle>
                        </DialogHeader>
                        {selectedReservation && (
                          <Card className="overflow-hidden bg-slate-200 dark:bg-muted/50 shadow-lg">
                            <CardContent className="p-0">
                              <div className="relative w-full h-64">
                                <Image
                                  src={selectedReservation.court.imageUrl[0]}
                                  alt={selectedReservation.court.name}
                                  layout="fill"
                                  objectFit="cover"
                                  onClick={() => setIsImageModalOpen(true)}
                                  className="cursor-pointer transition-transform hover:scale-105"
                                />
                                <Badge
                                  className={cn(
                                    "absolute top-2 right-2 px-2 py-1",
                                    getStatusColor(selectedReservation.status)
                                  )}
                                >
                                  {selectedReservation.status}
                                </Badge>
                              </div>
                              <div className="p-6">
                                <h3 className="text-2xl font-semibold mb-4">
                                  {selectedReservation.court.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                                  {truncateDescription(
                                    selectedReservation.court.description,
                                    50
                                  )}
                                </p>
                                <div className="grid grid-cols-2 gap-y-4 text-sm">
                                  <div className="flex items-center">
                                    <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
                                    <span>
                                      {new Date(
                                        selectedReservation.date
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <ClockIcon className="w-5 h-5 mr-2 text-gray-400" />
                                    <span>
                                      {selectedReservation.startTime} -{" "}
                                      {selectedReservation.endTime}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <ClockIcon className="w-5 h-5 mr-2 text-gray-400" />
                                    <span>
                                      {selectedReservation.totalHours} horas
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <CreditCardIcon className="w-5 h-5 mr-2 text-gray-400" />
                                    <span>
                                      $
                                      {selectedReservation.totalPrice.toFixed(
                                        2
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <Separator className="my-6" />
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-6">
                                  <MapPinIcon className="w-5 h-5 mr-2" />
                                  <span>
                                    {selectedReservation.court.address}
                                  </span>
                                </div>
                                {selectedReservation.linkPago ? (
                                  <Button className="w-full" asChild>
                                    <a
                                      href={selectedReservation.linkPago}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Pagar ahora{" "}
                                      <ExternalLinkIcon className="ml-2 h-4 w-4" />
                                    </a>
                                  </Button>
                                ) : (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                    El enlace de pago está en proceso de
                                    generación.
                                  </p>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal para mostrar la imagen a tamaño completo */}
      {selectedReservation && (
        <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
          <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] p-0">
            <div className="relative w-full h-full">
              <Image
                src={selectedReservation.court.imageUrl[0]}
                alt={selectedReservation.court.name}
                layout="fill"
                objectFit="contain"
              />
              <Button
                className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 transition-colors"
                variant="ghost"
                onClick={() => setIsImageModalOpen(false)}
              >
                <XIcon className="h-6 w-6 text-white" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

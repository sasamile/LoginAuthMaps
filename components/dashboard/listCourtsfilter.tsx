"use client";
import { format } from "date-fns";
import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { DollarSign, MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Court } from "@prisma/client";
import { useRouter } from "next/navigation";

function ListCourtsfilter({ canchas }: { canchas: Court[] }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  if (canchas.length === 0) {
    return (
      <div className="flex justify-center pt-12 col-span-12 md:col-span-8 lg:col-span-9 space-y-6">
        No hay canchas disponibles con esos filtros de búsqueda.
      </div>
    );
  }

  return (
    <div className="col-span-12 md:col-span-8 lg:col-span-9 space-y-6">
      {canchas.map((court: any) => (
        <CourtCard
          key={court.id}
          court={court}
          selected={selectedCourt === court.id}
          onSelect={() => setSelectedCourt(court)}
          onTimeSelect={setSelectedTimeSlot}
          selectedDate={selectedDate}
        />
      ))}
    </div>
  );
}

export default ListCourtsfilter;

const CourtCard = ({
  court,
  selected,
  onSelect,
  onTimeSelect,
  selectedDate,
  reservations = [], // Default to an empty array if not provided
}: any) => {
  const generateTimeSlots = (startTime: string, endTime: string): string[] => {
    const slots: string[] = [];
    let current = new Date(`2024-01-01 ${startTime}`);
    const end = new Date(`2024-01-01 ${endTime}`);

    while (current < end) {
      slots.push(
        current.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
      current = new Date(current.getTime() + 60 * 60 * 1000); // Añade 1 hora
    }

    return slots;
  };

  const timeSlots = generateTimeSlots(court.startTime, court.endTime);
  const router = useRouter();

  // Verificar si hay reservas para la fecha seleccionada
  const isDateReserved =
    reservations &&
    reservations.some(
      (reservation: any) =>
        reservation.date === format(selectedDate, "yyyy-MM-dd") &&
        reservation.courtId === court.id
    );

  return (
    <Card
      className={`transition-shadow hover:shadow-md cursor-pointer bg-muted/50${
        selected ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => router.push(`/dashboard/${court.id}`)}
    >
      <CardContent className="p-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <img
              src={court.imageUrl[0]}
              alt={court.name}
              className="w-full h-[200px] aspect-video object-cover rounded-lg"
            />
          </div>

          <div className="col-span-12 md:col-span-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{court.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {court.address.slice(0, 60)}
                  {court.address.length > 100 && "..."}
                </p>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {new Intl.NumberFormat("en-US").format(court.price)}/h
              </Badge>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {court.description.slice(0, 200)}
              {court.description.length > 100 && "..."}
            </p>

            <div>
              <h4 className="font-medium mb-2">Horarios de la cancha: </h4>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((slot: string) => (
                  <Button
                    key={slot}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onSelect();
                      onTimeSelect(slot);
                    }}
                    disabled={isDateReserved}
                    className={
                      isDateReserved ? "bg-gray-200 text-gray-400" : ""
                    }
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, DollarSign, MapPin, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Court } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { oswald } from "@/lib/font";
interface ListCourtsfilterProps {
  canchas: Court[];
  selectedDate?: Date;
}

function ListCourtsfilter({ canchas, selectedDate }: ListCourtsfilterProps) {
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const today = new Date(); // Obtener la fecha actual
  const dateToCheck = selectedDate || today; // Usar la fecha seleccionada o la actual

  const availableCanchas = canchas.filter((court) =>
    court.dates.some(
      (date) => format(date, "yyyy-MM-dd") === format(dateToCheck, "yyyy-MM-dd")
    )
  );

  if (availableCanchas.length === 0) {
    return (
      <div className="flex justify-center pt-12 col-span-12 md:col-span-8 lg:col-span-9 space-y-6">
        No hay canchas disponibles con esos filtros de búsqueda.
      </div>
    );
  }

  return (
    <div className="col-span-12 md:col-span-8 lg:col-span-9 space-y-6">
      {availableCanchas.map((court) => (
        <CourtCard
          key={court.id}
          court={court}
          selected={selectedCourt?.id === court.id}
          onSelect={() => setSelectedCourt(court)}
          onTimeSelect={setSelectedTimeSlot}
          selectedDate={dateToCheck} // Pasar la fecha a verificar
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
  reservations = [],
}: {
  court: Court;
  selected: boolean;
  onSelect: () => void;
  onTimeSelect: (time: string) => void;
  selectedDate?: Date;
  reservations?: any[];
}) => {
  const router = useRouter();
  const today = new Date();

  const isCourtOpenToday = court.dates.some(
    (date: Date) =>
      format(date, "yyyy-MM-dd") ===
      format(selectedDate || new Date(), "yyyy-MM-dd") // Usar la fecha actual si 'selectedDate' es undefined
  );

  return (
    <Card
      className={`transition-shadow hover:shadow-md cursor-pointer bg-white/50 dark:bg-muted/50 ${
        selected ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => router.push(`/dashboard/${court.id}`)}
    >
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 h-40">
            <div className="relative w-full h-64 md:h-full">
              <Image
                src={court.imageUrl[0]}
                alt={court.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg h-64"
              />
            </div>
          </div>

          <div className="w-full md:w-2/3 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className={`text-xl font-semibold uppercase ${oswald.className}`}
                >
                  {court.name}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {court.address.length > 60
                    ? `${court.address.slice(0, 60)}...`
                    : court.address}
                </p>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {new Intl.NumberFormat("es-ES").format(court.price)}/h
              </Badge>
            </div>

            <p className="text-sm text-gray-600">
              {court.description.length > 200
                ? `${court.description.slice(0, 200)}...`
                : court.description}
            </p>

            <div className="flex justify-between items-center text-sm">
              {selectedDate ? ( // Mostrar solo si hay una fecha seleccionada
                <>
                  <span>
                    {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", {
                      locale: es,
                    })}
                  </span>
                  {isCourtOpenToday ? (
                    <span className="text-green-500 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Abierto
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      Cerrado
                    </span>
                  )}
                </>
              ) : (
                // Si no hay fecha seleccionada, mostrar la fecha actual
                <>
                  <span>
                    {format(today, "EEEE, d 'de' MMMM 'de' yyyy", {
                      locale: es,
                    })}
                  </span>
                  {isCourtOpenToday ? (
                    <span className="text-green-500 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Abierto
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      Cerrado
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

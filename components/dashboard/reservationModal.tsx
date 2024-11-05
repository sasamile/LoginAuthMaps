"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { Court } from "@prisma/client";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { checkCourtAvailability } from "@/actions/reservation-actions";
import { createReservation } from "@/actions/reservation-actions";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  court: Court | null | undefined;
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  court,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [availableHours, setAvailableHours] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (court && selectedDate) {
      setSelectedTimeSlots([]);
      fetchAvailableHours();
    }
  }, [court, selectedDate]);

  useEffect(() => {
    if (selectedTimeSlots.length > 0 && court) {
      const hours = selectedTimeSlots.length;
      setTotalPrice(hours * court.price);
    } else {
      setTotalPrice(0);
    }
  }, [selectedTimeSlots, court]);

  const fetchAvailableHours = async () => {
    if (!court || !selectedDate) return;

    const start = parseInt(court.startTime);
    const end = parseInt(court.endTime);

    // Crear array de promesas para todas las verificaciones
    const availabilityChecks = [];

    for (let i = start; i <= end; i++) {
      const time = `${i.toString().padStart(2, "0")}:00`;
      const endTime = `${(i + 1).toString().padStart(2, "0")}:00`;
      const previousTime = `${(i - 1).toString().padStart(2, "0")}:00`;

      // Agregar ambas verificaciones como un par
      availabilityChecks.push(
        Promise.all([
          checkCourtAvailability(court.id, selectedDate, time, endTime),
          checkCourtAvailability(court.id, selectedDate, previousTime, time),
        ])
      );
    }

    // Ejecutar todas las verificaciones en paralelo
    const results = await Promise.all(availabilityChecks);

    // Procesar resultados
    const hours: TimeSlot[] = results.map((result, index) => {
      const time = `${(start + index).toString().padStart(2, "0")}:00`;
      const [currentSlot, previousSlot] = result;
      return {
        time,
        isAvailable: (currentSlot.available && previousSlot.available) ?? false,
      };
    });

    setAvailableHours(hours);
  };

  const isConsecutiveTime = (
    selectedSlots: string[],
    newTime: string
  ): boolean => {
    if (selectedSlots.length === 0) return true;

    const newHour = parseInt(newTime);
    const selectedHours = selectedSlots.map((time) => parseInt(time));
    const minSelected = Math.min(...selectedHours);
    const maxSelected = Math.max(...selectedHours);

    // Solo permitir selección contigua
    return (
      newHour === minSelected - 1 ||
      newHour === maxSelected + 1 ||
      (newHour >= minSelected && newHour <= maxSelected)
    );
  };

  const handleTimeSlotClick = (time: string) => {
    setSelectedTimeSlots((prev) => {
      if (prev.includes(time)) {
        // Si ya está seleccionado, eliminar todas las horas después de esta
        const timeIndex = prev.indexOf(time);
        return prev.slice(0, timeIndex);
      } else {
        const timeHour = parseInt(time);
        if (prev.length === 0) {
          return [time];
        }

        // Obtener la primera hora seleccionada
        const firstHour = parseInt(prev[0]);

        // Crear un array con todas las horas consecutivas desde la primera hasta la nueva
        const newSlots = [];
        const start = Math.min(firstHour, timeHour);
        const end = Math.max(firstHour, timeHour);

        for (let i = start; i <= end; i++) {
          newSlots.push(`${i.toString().padStart(2, "0")}:00`);
        }

        return newSlots;
      }
    });
  };

  const handleSubmit = async () => {
    if (!session?.user?.email) {
      toast.error("Por favor inicie sesión para hacer una reserva");
      return;
    }

    if (!selectedDate) {
      toast.error("Por favor seleccione una fecha");
      return;
    }

    if (selectedTimeSlots.length === 0) {
      toast.error("Por favor seleccione al menos un horario");
      return;
    }

    if (!court) {
      toast.error("No se ha seleccionado una cancha válida");
      return;
    }

    try {
      setIsLoading(true);

      const result = await createReservation({
        courtId: court.id,
        email: session.user.email,
        date: selectedDate,
        startTime: selectedTimeSlots[0],
        endTime: selectedTimeSlots[selectedTimeSlots.length - 1],
        totalHours: selectedTimeSlots.length,
        totalPrice,
      });

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success("Reserva creada exitosamente");
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Reservation error:", error);
      toast.error("Error al crear la reserva");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-[550px] p-3 md:p-4">
        <DialogHeader className="space-y-1 mb-2">
          <DialogTitle className="text-lg font-semibold">
            Reservar Cancha {court?.name}
          </DialogTitle>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Precio/hora: ${court?.price}</span>
            <span>
              Horario: {court?.startTime}:00 - {court?.endTime}:00
            </span>
          </div>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-3">
          {/* Calendario */}
          <div className="w-full md:w-1/2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) =>
                date < new Date() ||
                !court?.dates?.some(
                  (d) => new Date(d).toDateString() === date.toDateString()
                )
              }
              className="rounded-md border p-1"
            />
          </div>

          {/* Horarios */}
          <div className="w-full md:w-1/2 space-y-2">
            <div className="bg-muted/10 p-2 rounded-lg">
              <div className="grid grid-cols-3 gap-1">
                {availableHours.map((slot) => {
                  const isDisabled =
                    !slot.isAvailable ||
                    (selectedTimeSlots.length > 0 &&
                      !isConsecutiveTime(selectedTimeSlots, slot.time));

                  return (
                    <Button
                      key={slot.time}
                      variant={
                        selectedTimeSlots.includes(slot.time)
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleTimeSlotClick(slot.time)}
                      disabled={isDisabled}
                      className={`
                      text-xs py-1 h-8
                      ${isDisabled && "opacity-50"}
                      ${
                        selectedTimeSlots.includes(slot.time) &&
                        "bg-primary text-primary-foreground"
                      }
                    `}
                    >
                      {slot.time}
                    </Button>
                  );
                })}
              </div>

              <div className="mt-2 text-xs space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>Fecha: {selectedDate?.toLocaleDateString()}</span>
                  <span>Horas: {selectedTimeSlots.length}</span>
                </div>
                <div className="flex justify-between items-center bg-primary/5 p-2 rounded">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">${totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-3 gap-2">
          <Button variant="outline" onClick={onClose} className="h-8 text-sm">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !selectedDate || selectedTimeSlots.length === 0 || isLoading
            }
            className="h-8 text-sm"
          >
            {isLoading ? "Procesando..." : "Confirmar Reserva"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationModal;

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Court } from "@prisma/client";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  checkCourtAvailability,
  createReservation,
} from "@/actions/reservation-actions";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [availableHours, setAvailableHours] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHours, setIsLoadingHours] = useState(false);

  const fetchAvailableHours = useCallback(async () => {
    if (!court || !selectedDate) return;

    setIsLoadingHours(true);
    const start = parseInt(court.startTime);
    const end = parseInt(court.endTime);

    try {
      const { existingReservations } = await checkCourtAvailability(
        court.id,
        selectedDate
      );

      const hours: TimeSlot[] = [];

      for (let hour = start; hour < end; hour++) {
        const currentTimeStr = `${hour.toString().padStart(2, "0")}:00`;

        // Verificar si la hora actual está dentro de alguna reserva
        const isReserved = existingReservations?.some((reservation) => {
          const startHour = parseInt(reservation.startTime.split(":")[0]);
          const endHour = parseInt(reservation.endTime.split(":")[0]);

          // Cambio clave: incluir la hora final en el rango de horas reservadas
          return hour >= startHour && hour < endHour;
        });

        hours.push({
          time: currentTimeStr,
          isAvailable: !isReserved,
        });
      }

      // Procesar la última hora de cada reserva
      existingReservations?.forEach((reservation) => {
        const endHour = parseInt(reservation.endTime.split(":")[0]);
        const endTimeStr = `${endHour.toString().padStart(2, "0")}:00`;

        // Encontrar y marcar como no disponible la última hora de la reserva
        const lastHourSlot = hours.find((slot) => slot.time === endTimeStr);
        if (lastHourSlot) {
          lastHourSlot.isAvailable = false;
        }
      });

      console.log(
        "Existing Reservations:",
        existingReservations?.map((r) => ({
          start: r.startTime,
          end: r.endTime,
        }))
      );
      console.log("Available Hours:", hours);

      setAvailableHours(hours);
    } catch (error) {
      console.error("Error fetching available hours:", error);
      toast.error("Error al cargar los horarios disponibles");
    } finally {
      setIsLoadingHours(false);
    }
  }, [court, selectedDate]);
  useEffect(() => {
    if (court && selectedDate) {
      setSelectedTimeSlots([]);
      fetchAvailableHours();
    }
  }, [court, selectedDate, fetchAvailableHours]);

  useEffect(() => {
    if (selectedTimeSlots.length > 0 && court) {
      const hours = selectedTimeSlots.length;
      setTotalPrice(hours * court.price);
    } else {
      setTotalPrice(0);
    }
  }, [selectedTimeSlots, court]);

  const handleTimeSlotClick = (time: string) => {
    // No permitir selección de slots no disponibles
    const slot = availableHours.find((h) => h.time === time);
    if (!slot?.isAvailable) {
      return;
    }

    setSelectedTimeSlots((prev) => {
      if (prev.includes(time)) {
        // Si ya está seleccionado, removerlo y todos los que siguen
        const index = prev.indexOf(time);
        return prev.slice(0, index);
      }

      if (prev.length === 0) {
        // Primera selección
        return [time];
      }

      // Verificar si es consecutivo y todas las horas intermedias están disponibles
      const lastSelected = prev[prev.length - 1];
      const lastHour = parseInt(lastSelected.split(":")[0]);
      const currentHour = parseInt(time.split(":")[0]);

      if (currentHour !== lastHour + 1) {
        // Si no es consecutivo, comenzar nueva selección
        return [time];
      }

      // Verificar que todas las horas intermedias estén disponibles
      for (let h = lastHour; h <= currentHour; h++) {
        const hourStr = `${h.toString().padStart(2, "0")}:00`;
        const isAvailable = availableHours.find(
          (slot) => slot.time === hourStr
        )?.isAvailable;
        if (!isAvailable) {
          return [time]; // Si hay alguna hora no disponible, comenzar nueva selección
        }
      }

      return [...prev, time].sort();
    });
  };

  const renderTimeSlots = () => {
    return availableHours.map((slot) => {
      const isSelected = selectedTimeSlots.includes(slot.time);
      const currentHour = parseInt(slot.time.split(":")[0]);

      // Determine if this slot can be selected (is consecutive)
      let canSelect = true;
      if (selectedTimeSlots.length > 0) {
        const lastSelectedHour = parseInt(
          selectedTimeSlots[selectedTimeSlots.length - 1].split(":")[0]
        );
        canSelect = currentHour === lastSelectedHour + 1;
      }

      return (
        <Button
          key={slot.time}
          variant={isSelected ? "default" : "outline"}
          onClick={() => handleTimeSlotClick(slot.time)}
          disabled={
            !slot.isAvailable ||
            (!isSelected && !canSelect && selectedTimeSlots.length > 0)
          }
          className={`
            text-xs py-1 h-8
            ${!slot.isAvailable && "opacity-50"}
            ${isSelected && "bg-primary text-primary-foreground"}
            ${
              !canSelect &&
              selectedTimeSlots.length > 0 &&
              !isSelected &&
              "opacity-50"
            }
          `}
        >
          {slot.time}
        </Button>
      );
    });
  };

  const handleSubmit = async () => {
    if (!session?.user?.email) {
      toast.error("Por favor inicie sesión para hacer una reserva");
      return;
    }

    if (!selectedDate || selectedTimeSlots.length === 0 || !court) {
      toast.error("Por favor complete todos los campos");
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

      router.push("/dashboard/reservas");
      toast.success("Reserva creada exitosamente");
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

          <div className="w-full md:w-1/2 space-y-2">
            <div className="bg-muted/10 p-2 rounded-lg">
              <div className="grid grid-cols-3 gap-1">
                {isLoadingHours
                  ? Array.from({ length: 12 }).map((_, index) => (
                      <Skeleton key={index} className="h-8 w-full" />
                    ))
                  : availableHours.map((slot) => {
                      const isSelected = selectedTimeSlots.includes(slot.time);
                      const canSelect =
                        selectedTimeSlots.length === 0 ||
                        (selectedTimeSlots.length > 0 &&
                          parseInt(slot.time) ===
                            parseInt(
                              selectedTimeSlots[selectedTimeSlots.length - 1]
                            ) +
                              1);

                      return (
                        <Button
                          key={slot.time}
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => handleTimeSlotClick(slot.time)}
                          disabled={!slot.isAvailable}
                          className={`
                  text-xs py-1 h-8
                  ${
                    !slot.isAvailable &&
                    "opacity-50 cursor-not-allowed bg-gray-200"
                  }
                  ${isSelected && "bg-primary text-primary-foreground"}
                `}
                        >
                          {slot.time}
                          {!slot.isAvailable && " 🔒"}
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

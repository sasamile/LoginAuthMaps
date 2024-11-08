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
      const availabilityPromises = [];
      for (let i = start; i <= end; i++) {
        const time = `${i.toString().padStart(2, "0")}:00`;
        const endTime = `${(i + 1).toString().padStart(2, "0")}:00`;
        availabilityPromises.push(
          checkCourtAvailability(court.id, selectedDate, time, endTime)
        );
      }

      const results = await Promise.all(availabilityPromises);

      const hours: TimeSlot[] = results.map((result, index) => ({
        time: `${(start + index).toString().padStart(2, "0")}:00`,
        isAvailable: result.available ?? false, // Use nullish coalescing to default to false
      }));

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
    setSelectedTimeSlots((prev) => {
      if (prev.includes(time)) {
        return prev.filter((t) => t !== time);
      } else {
        const newSlots = [...prev, time].sort();
        return newSlots;
      }
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
                  : availableHours.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={
                          selectedTimeSlots.includes(slot.time)
                            ? "default"
                            : "outline"
                        }
                        onClick={() => handleTimeSlotClick(slot.time)}
                        disabled={!slot.isAvailable}
                        className={`
                        text-xs py-1 h-8
                        ${!slot.isAvailable && "opacity-50"}
                        ${
                          selectedTimeSlots.includes(slot.time) &&
                          "bg-primary text-primary-foreground"
                        }
                      `}
                      >
                        {slot.time}
                      </Button>
                    ))}
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

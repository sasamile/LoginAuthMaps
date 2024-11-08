"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

export function ReservationFilters({ courts }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (startDate) params.set("startDate", startDate.toISOString());
    if (endDate) params.set("endDate", endDate.toISOString());
    router.push(`/reservas?${params.toString()}`);
  };

  return (
    <div className="flex space-x-4 mb-4">
      <Select
        onValueChange={(value) => router.push(`/reservas?courtId=${value}`)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filtrar por cancha" />
        </SelectTrigger>
        <SelectContent>
          {courts.map((court: any) => (
            <SelectItem key={court.id} value={court.id}>
              {court.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => router.push(`/reservas?status=${value}`)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filtrar por estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PENDING">Pendiente</SelectItem>
          <SelectItem value="SUCCESS">Exitosa</SelectItem>
          <SelectItem value="DENIED">Denegada</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[240px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "PPP") : <span>Fecha inicio</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={setStartDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[240px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "PPP") : <span>Fecha fin</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={setEndDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button onClick={handleFilter}>Aplicar Filtros</Button>
    </div>
  );
}

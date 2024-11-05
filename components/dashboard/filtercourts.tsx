"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Calendar } from "../ui/calendar";
import { Court } from "@prisma/client";
import { Input } from "../ui/input";

interface FilterFormProps {
  canchas: Court[];
  onFilter: (filtered: Court[]) => void;
}

function Filtercourts({ canchas, onFilter }: FilterFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState(100000);
  const [timeSlot, setTimeSlot] = useState("");

  useEffect(() => {
    applyFilters();
  }, [selectedDate, name, address, price, timeSlot]);

  const applyFilters = () => {
    let filtered = canchas;

    if (name) {
      filtered = filtered.filter((cancha) =>
        cancha.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (address) {
      filtered = filtered.filter((cancha) =>
        cancha.address.toLowerCase().includes(address.toLowerCase())
      );
    }

    if (selectedDate) {
      filtered = filtered.filter((cancha) =>
        cancha.dates.some(
          (d) =>
            new Date(d).toISOString().split("T")[0] ===
            selectedDate.toISOString().split("T")[0]
        )
      );
    }

    filtered = filtered.filter((cancha) => cancha.price <= price);

    if (timeSlot) {
      filtered = filtered.filter((cancha) => {
        const startTime = parseInt(cancha.startTime.split(":")[0]);
        const endTime = parseInt(cancha.endTime.split(":")[0]);

        if (timeSlot === "morning") {
          return startTime < 12 || endTime <= 12;
        } else if (timeSlot === "afternoon") {
          return (
            (startTime >= 12 && startTime < 18) ||
            (endTime > 12 && endTime <= 18)
          );
        } else if (timeSlot === "evening") {
          return startTime >= 18 || endTime > 18;
        }
        return true;
      });
    }

    onFilter(filtered);
  };

  return (
    <div className="col-span-12 md:col-span-4 lg:col-span-3 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtrar Disponibilidad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="py-4">
              <label className="block text-sm font-medium mb-2">
                Nombre de la cancha
              </label>
              <Input
                type="text"
                placeholder="Nombre de la cancha"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>

            <label className="block text-sm font-medium mb-2">Fecha</label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
              }}
              className="rounded-md border"
            />

            <div className="py-4">
              <label className="block text-sm font-medium mb-2">
                Dirección de la cancha
              </label>
              <Input
                type="text"
                placeholder="Dirección de la cancha"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Horario</label>
              <select
                className="w-full rounded-md border border-gray-300 p-2"
                value={timeSlot}
                onChange={(e) => {
                  setTimeSlot(e.target.value);
                }}
              >
                <option value="">Cualquier horario</option>
                <option value="morning">Mañana (8:00 - 12:00)</option>
                <option value="afternoon">Tarde (12:00 - 18:00)</option>
                <option value="evening">Noche (18:00 - 22:00)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Precio máximo
              </label>
              <input
                type="range"
                className="w-full"
                min="0"
                max="100000"
                step="5000"
                value={price}
                onChange={(e) => {
                  setPrice(parseInt(e.target.value));
                }}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>$0</span>
                <span>$100.000</span>
              </div>
              <div className="text-center font-medium text-sm mt-2">
                ${price}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Filtercourts;

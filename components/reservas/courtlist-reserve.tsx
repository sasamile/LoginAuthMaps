"use client";

import { getCourtAllID } from "@/actions/canchas-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CreditCardIcon,
} from "lucide-react";
import Image from "next/image";
import React from "react";

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
  createdAt: Date;
  updatedAt: Date;
  court: Court;
}

interface CourtListReserveProps {
  reservas?: Reservation[];
}

export default function CourtListReserve({ reservas }: CourtListReserveProps) {
  function truncateDescription(description: string, wordLimit: number) {
    const words = description.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : description;
  }

  return (
    <div className=" max-w-5xl space-y-4 mx-auto py-12">
      {reservas?.map((reserva) => (
        <Card key={reserva.id} className="overflow-hidden bg-muted/50">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-1/3 ">
                <Image
                  src={reserva.court.imageUrl[0]}
                  alt={reserva.court.name}
                  layout="fill"
                  objectFit="cover"
                />
                <Badge className="absolute top-2 right-2">
                  {reserva.status}
                </Badge>
              </div>
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">
                    {reserva.court.name}
                  </h3>
                  <span className="text-lg font-bold">
                    ${reserva.totalPrice}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {truncateDescription(reserva.court.description, 100)}
                </p>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{new Date(reserva.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>
                      {reserva.startTime} - {reserva.endTime}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{reserva.totalHours} horas</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCardIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>${reserva.totalPrice}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  <span>{reserva.court.address}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CourtDetails } from "./court-details";
import { useSession } from "next-auth/react";
import { getListBack } from "@/actions/canchas-actions";
import { Court } from "@prisma/client";
// import { CourtDetails } from "@/components/dashboard/court-details"

const mockCourts = [
  {
    id: "1",
    name: "Cancha Principal",
    address: "Calle 123, Ciudad Deportiva",
    description:
      "Cancha de fútbol 5 con césped sintético de última generación.",
    price: 50,
    image:
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    latitude: -34.603722,
    longitude: -58.381592,
  },
  {
    id: "2",
    name: "Cancha Auxiliar",
    address: "Avenida Central 456, Complejo Deportivo",
    description: "Cancha de fútbol 7 con iluminación nocturna.",
    price: 60,
    image:
      "https://images.unsplash.com/photo-1624880357913-a8539238245b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    latitude: -34.605778,
    longitude: -58.383889,
  },
  {
    id: "3",
    name: "Cancha Multideporte",
    address: "Plaza del Deporte 789",
    description: "Cancha polivalente para fútbol, baloncesto y voleibol.",
    price: 55,
    image:
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    latitude: -34.601944,
    longitude: -58.385833,
  },
];

// Define el tipo Coordinates
interface Coordinates {
  lat: number;
  lng: number;
}

// Define el tipo Court2 según lo que esperas recibir de la API
export interface Court2 {
  id: string;
  name: string;
  address: string;
  description: string;
  dates: Date[]; // Si no necesitas esto, puedes eliminarlo
  startTime: string; // Si no necesitas esto, puedes eliminarlo
  endTime: string; // Si no necesitas esto, puedes eliminarlo
  price: number;
  imageUrl: string;
  coordinates: Coordinates | null; // Cambia a un objeto con lat y lng
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export function CourtList() {
  const { data: session } = useSession();

  const [List, setList] = useState<Court2[]>([]);

const getList = async () => {
  if (!session?.user.email) {
    throw new Error("No estás autenticado. Por favor, inicia sesión.");
  }

  const response = await getListBack(session.user.email);
  if (!response) {
    throw new Error("No se encontraron canchas.");
  }

  const formattedResponse = response.map((court: any) => ({
    id: court.id,
    name: court.name,
    address: court.address,
    description: court.description,
    dates: court.dates || [], // Asegúrate de que sea un array
    startTime: court.startTime || "", // Asegúrate de manejar valores por defecto
    endTime: court.endTime || "", // Asegúrate de manejar valores por defecto
    price: court.price,
    imageUrl: court.imageUrl,
    coordinates: court.coordinates ? JSON.parse(court.coordinates) : null,
    createdAt: new Date(court.createdAt),
    updatedAt: new Date(court.updatedAt),
    userId: court.userId,
    image: court.imageUrl, // Asumiendo que imageUrl es lo que necesitas
    latitude: court.coordinates ? court.coordinates.lat : 0, // Asume un valor por defecto si es null
    longitude: court.coordinates ? court.coordinates.lng : 0, // Asume un valor por defecto si es null
  }));

  setList(formattedResponse);
};

  useEffect(() => {
    getList();
  }, [List]);

  const [selectedCourt, setSelectedCourt] = useState<Court2 | null>(null);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="space-y-4">
      {selectedCourt ? (
        <CourtDetails
          court={selectedCourt}
          onBack={() => setSelectedCourt(null)}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {List.map((court) => (
            <Card key={court.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{court.name}</CardTitle>
                <CardDescription>{court.address}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <img
                  src={court.imageUrl}
                  alt={court.name}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
                <p className="text-sm text-gray-600"> {truncateText(court.description, 100)}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-lg font-bold">${court.price}/hora</p>
                <Button
                  onClick={() =>
                    setSelectedCourt(court)
                  }
                >
                  Ver Detalles
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

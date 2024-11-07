"use client";
import { firstCourts } from "@/actions/canchas-actions";
import GoogleMapSection from "@/app/(protected)/admin/_components/GoogleMapSection";
import NavButton from "@/components/dashboard/navbutton";
import ReservationModal from "@/components/dashboard/reservationModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar2 } from "@/components/ui/calendar2";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Court } from "@prisma/client";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ImageGallery = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative group">
      {/* Imagen Principal */}
      <div className="relative aspect-video overflow-hidden rounded-lg shadow-lg">
        <img
          src={images[currentIndex]}
          alt={`Vista ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500"
        />

        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Controles de navegación */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Indicadores de imagen */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? "bg-white w-4"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="hidden md:grid grid-cols-4 gap-2 mt-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-video rounded-md overflow-hidden ${
                idx === currentIndex
                  ? "ring-2 ring-primary"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Miniatura ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const formatTimeRange = (startTime?: string, endTime?: string) => {
  if (!startTime || !endTime) return "";

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

function page({ params }: { params: { courtsId: string } }) {
  const router = useRouter();
  const [court, setCourts] = useState<Court | null>();
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const firtsCourt = async () => {
    const result = await firstCourts(params.courtsId);
    setCourts(result);
    setIsLoading(false);
  };
  useEffect(() => {
    firtsCourt();
  }, []);

  const availableDates = court?.dates.map((date) => new Date(date));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-4 text-xl font-semibold">
            Cargando información de la cancha...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="border-b p-4 ">
        <div className="flex justify-between w-full">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Volver a la lista
          </Button>
          <Button
            className="px-8"
            onClick={() => setIsReservationModalOpen(true)}
          >
            Reservar ahora
          </Button>
        </div>
      </div>

      <div className="border-b">
        <div className="flex items-center justify-between">
          <div className="p-8">
            <h2 className="text-2xl font-bold">{court?.name}</h2>
            <span className="flex items-center gap-2 mt-2">
              <MapPin className="w-4 h-4" />
              {court?.address}
            </span>
          </div>
          <Badge
            variant="secondary"
            className="text-lg px-4 py-2 flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            {court?.price}/hora
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Columna izquierda: Galería de imágenes y descripción */}
          <div className="col-span-12 md:col-span-7 space-y-6">
            <ImageGallery images={court?.imageUrl ?? []} />

            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Acerca de la cancha</h3>
              <p className="text-muted-foreground leading-relaxed">
                {court?.description}
              </p>
            </div>
          </div>

          {/* Columna derecha: Calendario y horarios */}
          <div className="col-span-12 md:col-span-5 space-y-6">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Disponibilidad</h3>
              </div>
              <div className=" flex justify-center items-center">
                <Calendar2
                  mode="multiple"
                  selected={availableDates}
                  className="rounded-md border w-[80%] flex justify-center items-center"
                  disabled={(date) =>
                    !availableDates?.some(
                      (d) => d.toDateString() === date.toDateString()
                    )
                  }
                />
              </div>

              <div className="mt-4 p-3 bg-muted/30 rounded-md">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium">
                    Horario: {formatTimeRange(court?.startTime, court?.endTime)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <span className="text-2xl font-bold text-primary">
                  {availableDates?.length}
                </span>
                <p className="text-sm text-muted-foreground">
                  Días disponibles
                </p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <span className="text-2xl font-bold text-primary">
                  {parseInt(court?.endTime ?? "0") -
                    parseInt(court?.startTime ?? "0")}
                </span>
                <p className="text-sm text-muted-foreground">Horas por día</p>
              </div>
            </div>
            <div className="w-full h-80 rounded-lg overflow-hidden shadow-md">
              <GoogleMapSection
                coordinates={
                  court?.coordinates
                    ? ((typeof court.coordinates === "string"
                        ? JSON.parse(court.coordinates)
                        : court.coordinates) as { lat: number; lng: number })
                    : { lat: 0, lng: 0 }
                }
              />
            </div>
          </div>
        </div>
      </div>

      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        court={court}
      />
    </div>
  );
}

export default page;

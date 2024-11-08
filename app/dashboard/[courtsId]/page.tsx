"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Court } from "@prisma/client";
import { firstCourts } from "@/actions/canchas-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar2 } from "@/components/ui/calendar2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { oswald } from "@/lib/font";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  MapPin,
} from "lucide-react";
import GoogleMapSection from "@/app/(protected)/admin/_components/GoogleMapSection";
import ReservationModal from "@/components/dashboard/reservationModal";

const ImageGallery = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative group">
      <div className="relative aspect-video overflow-hidden rounded-lg shadow-lg">
        <img
          src={images[currentIndex]}
          alt={`Vista ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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

export default function CourtReservationPage({
  params,
}: {
  params: { courtsId: string };
}) {
  const router = useRouter();
  const [court, setCourt] = useState<Court | null>();
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourt = async () => {
      const result = await firstCourts(params.courtsId);
      setCourt(result);
      setIsLoading(false);
    };
    fetchCourt();
  }, [params.courtsId]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Volver a la lista
        </Button>
        <Button
          className="px-8"
          onClick={() => setIsReservationModalOpen(true)}
        >
          Reservar ahora
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-7 ">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle
                  className={`text-3xl font-bold uppercase ${oswald.className}`}
                >
                  {court?.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground flex items-center mt-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {court?.address}
                </p>
              </div>
              <Badge
                variant="secondary"
                className="text-lg px-4 py-2 flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                {court?.price}/hora
              </Badge>
            </CardHeader>
            <CardContent>
              <ImageGallery images={court?.imageUrl ?? []} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acerca de la cancha</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {court?.description}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 md:col-span-5 space-y-6">
          <Card className="bg-card border rounded-lg p-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Disponibilidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar2
                mode="multiple"
                selected={availableDates}
                className="rounded-md border p-1 "
                disabled={(date) =>
                  !availableDates?.some(
                    (d) => d.toDateString() === date.toDateString()
                  )
                }
              />
              <div className="mt-4 p-3 bg-muted/30 rounded-md">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium">
                    Horario: {formatTimeRange(court?.startTime, court?.endTime)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <span className="text-2xl font-bold text-primary">
                    {availableDates?.length}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    Días disponibles
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <span className="text-2xl font-bold text-primary">
                    {parseInt(court?.endTime ?? "0") -
                      parseInt(court?.startTime ?? "0")}
                  </span>
                  <p className="text-sm text-muted-foreground">Horas por día</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Ubicación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 rounded-lg overflow-hidden shadow-md">
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
            </CardContent>
          </Card>
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

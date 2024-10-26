import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Clock, MapPin, DollarSign, Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";

import { Court2 } from "./CourtList";
import GoogleMapSection from "./GoogleMapSection";

interface CourtDetailsProps {
  court: Court2;
  onBack: () => void;
}

const formatTimeRange = (startTime: string, endTime: string) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

export function CourtDetails({ court, onBack }: CourtDetailsProps) {
  const availableDates = court.dates.map(date => new Date(date));
  
  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">{court.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <MapPin className="w-4 h-4" />
              {court.address}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            {court.price}/hora
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Columna izquierda: Imagen y descripción */}
          <div className="col-span-12 md:col-span-7 space-y-6">
            <div className="relative group">
              <img
                src={court.imageUrl}
                alt={court.name}
                className="w-full aspect-video object-cover rounded-lg shadow-lg transition-transform group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Acerca de la cancha</h3>
              <p className="text-muted-foreground leading-relaxed">
                {court.description}
              </p>
            </div>

            {/* Mapa en tamaño reducido */}
            <div className="h-60 rounded-lg overflow-hidden shadow-md">
              <GoogleMapSection coordinates={court.coordinates} />
            </div>
          </div>

          {/* Columna derecha: Calendario y horarios */}
          <div className="col-span-12 md:col-span-5 space-y-6">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Disponibilidad</h3>
              </div>
              
              <Calendar
                mode="multiple"
                selected={availableDates}
                className="rounded-md border"
                disabled={(date) => !availableDates.some(
                  d => d.toDateString() === date.toDateString()
                )}
              />

              <div className="mt-4 p-3 bg-muted/30 rounded-md">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium">
                    Horario: {formatTimeRange(court.startTime, court.endTime)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats o información adicional */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <span className="text-2xl font-bold text-primary">
                  {availableDates.length}
                </span>
                <p className="text-sm text-muted-foreground">Días disponibles</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <span className="text-2xl font-bold text-primary">
                  {parseInt(court.endTime) - parseInt(court.startTime)}
                </span>
                <p className="text-sm text-muted-foreground">Horas por día</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t p-6">
        <div className="flex justify-between w-full">
          <Button variant="outline" onClick={onBack}>
            Volver a la lista
          </Button>
          <Button className="px-8">
            Reservar ahora
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
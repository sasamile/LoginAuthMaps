import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Court {
  id: string;
  name: string;
  address: string;
  description: string;
  dates: Date[];
  startTime: string;
  endTime: string;
  price: number;
  imageUrl: string;
  coordinates: any;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface CourtCardProps {
  cancha: Court;
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
};

const formatTimeRange = (startTime: string, endTime: string) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

const CourtCard: React.FC<CourtCardProps> = ({ cancha }) => {
  const nextThreeDates = cancha.dates
    .slice(0, 3)
    .map(date => new Date(date))
    .sort((a, b) => a.getTime() - b.getTime());

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{cancha.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {cancha.address}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg font-semibold">
            ${cancha.price}/hr
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="relative h-48 mb-4">
          <img
            src={cancha.imageUrl}
            alt={cancha.name}
            className="absolute inset-0 w-full h-full object-cover rounded-md"
          />
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {truncateText(cancha.description, 100)}
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              Horario: {formatTimeRange(cancha.startTime, cancha.endTime)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Próximas fechas disponibles:</span>
          </div>

          <ScrollArea className="h-20">
            <div className="space-y-2">
              {nextThreeDates.map((date, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 hover:bg-muted cursor-pointer">
                        <Badge variant="outline" className="font-normal">
                          {format(date, "EEEE", { locale: es })}
                        </Badge>
                        <span className="text-sm">
                          {format(date, "d 'de' MMMM", { locale: es })}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Horario disponible: {formatTimeRange(cancha.startTime, cancha.endTime)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Button className="w-full">Ver Detalles y Reservar</Button>
      </CardFooter>
    </Card>
  );
};

export default CourtCard;
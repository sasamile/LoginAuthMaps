import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Court2 } from "./CourtList";
import GoogleMapSection from "./GoogleMapSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function CourtDetails({
  court,
  onBack,
}: {
  court: Court2;
  onBack: () => void;
}) {
  const truncateText = (text: string, maxLength: number) => {
    return text.length <= maxLength ? text : text.substr(0, maxLength) + "...";
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    };
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const nextThreeDates = court.dates
    .slice(0, 3)
    .map(date => new Date(date))
    .sort((a, b) => a.getTime() - b.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>{court.name}</CardTitle>
        <CardDescription>{court.address}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <img
          src={court.imageUrl}
          alt={court.name}
          className="w-full h-80 object-cover rounded-md"
        />
        <p className="text-sm text-gray-600">{court.description}</p>
        <p className="text-lg font-bold">${court.price}/hora</p>

        <GoogleMapSection coordinates={court.coordinates} />

        <div>
          <h3 className="text-lg font-bold">Fechas Disponibles</h3>
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
                      <p>Horario disponible: {formatTimeRange(court.startTime, court.endTime)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            Horario: {formatTimeRange(court.startTime, court.endTime)}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onBack}>Volver a la lista</Button>
      </CardFooter>
    </Card>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CourtDetails } from "./court-details";
import { useSession } from "next-auth/react";
import { Court } from "@prisma/client";
import {
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  MapPin,
  Camera,
  DollarSign,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar2 } from "@/components/ui/calendar2";
import { FileUpload } from "@/components/file-upload";
import Image from "next/image";
import GoogleAddressSearch from "@/app/(protected)/admin/_components/GoogleAddressSearch";
import GoogleMapSection from "@/app/(protected)/admin/_components/GoogleMapSection";
import {
  deleteCourt,
  getListBack,
  updateCourt,
} from "@/actions/canchas-actions";
import { deleteImageFile } from "@/actions/uploadthing-actions";
import { EditCourtForm } from "@/components/EditCourtForm";

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

export function CourtList() {
  const { data: session } = useSession();
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<{
    label: string;
    value: any;
  } | null>(null);

  const fetchCourts = async () => {
    if (!session?.user.email) {
      toast.error("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    try {
      const response = await getListBack(session.user.email);
      if (!response) {
        toast.error("No se encontraron canchas.");
        return;
      }

      const formattedResponse = response.map((court: any) => ({
        ...court,
        dates: court.dates || [],
        startTime: court.startTime || "",
        endTime: court.endTime || "",
        coordinates: court.coordinates ? JSON.parse(court.coordinates) : null,
        createdAt: new Date(court.createdAt),
        updatedAt: new Date(court.updatedAt),
        image: court.imageUrl[0],
        latitude: court.coordinates ? court.coordinates.lat : 0,
        longitude: court.coordinates ? court.coordinates.lng : 0,
      }));

      setCourts(formattedResponse);
    } catch (error) {
      toast.error("Error al cargar las canchas.");
      console.error("Error fetching courts:", error);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, [session]);

  const handleDelete = async (courtId: string) => {
    try {
      await deleteCourt(courtId);
      toast.success("Cancha eliminada con éxito");
      fetchCourts();
    } catch (error) {
      toast.error("Error al eliminar la cancha");
      console.error("Error deleting court:", error);
    }
  };

  const handleEdit = (court: Court) => {
    setEditingCourt(court);
    setCoordinates(
      typeof court.coordinates === "string"
        ? JSON.parse(court.coordinates)
        : court.coordinates
    );
    setSelectedAddress({ label: court.address, value: {} });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (formData: any) => {
    // Change parameter type
    if (!editingCourt || !session?.user.email) return;

    try {
      const updatedCourt = {
        id: editingCourt.id,
        name: formData.name,
        address: selectedAddress?.label || editingCourt.address,
        description: formData.description,
        price: parseFloat(formData.price),
        dates: formData.dates,
        startTime: formData.startTime,
        endTime: formData.endTime,
        imageUrl: formData.imageUrl,
        coordinates: coordinates || { lat: 0, lng: 0 },
        email: session.user.email,
      };

      const result = await updateCourt(updatedCourt);

      if (!result.success) {
        throw new Error(result.error || "Error al actualizar la cancha");
      }

      toast.success("Cancha actualizada con éxito");
      setIsEditDialogOpen(false);
      fetchCourts();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al actualizar la cancha"
      );
      console.error("Error updating court:", error);
    }
  };

  const handleDeleteImage = async (url: string) => {
    if (editingCourt) {
      try {
        await deleteImageFile(url);
        setEditingCourt({
          ...editingCourt,
          imageUrl: editingCourt.imageUrl.filter((imgUrl) => imgUrl !== url),
        });
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error("Error al eliminar la imagen");
      }
    }
  };

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
          {courts.map((court) => (
            <Card key={court.id} className="flex flex-col overflow-hidden">
              <CardHeader className="relative p-0">
                <img
                  src={court.imageUrl[0]}
                  alt={court.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(court)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(court.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-4">
                <CardTitle className="mb-2">{court.name}</CardTitle>
                <p className="text-sm text-muted-foreground mb-2">
                  {court.address}
                </p>
                <p className="text-sm">
                  {truncateText(court.description, 100)}
                </p>
              </CardContent>
              <div className="p-4 bg-muted/10">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold">${court.price}/hora</p>
                  <Button
                    onClick={() => setSelectedCourt(court)}
                    variant="outline"
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Editar Cancha</DialogTitle>
            <DialogDescription>
              Actualiza los detalles de la cancha aquí. Haz clic en guardar
              cuando hayas terminado.
            </DialogDescription>
          </DialogHeader>
          <EditCourtForm
            court={editingCourt}
            onSubmit={handleUpdate}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            onClose={() => setIsEditDialogOpen(false)}
            onDeleteImage={handleDeleteImage}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

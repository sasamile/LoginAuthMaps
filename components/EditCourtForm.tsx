"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formSchema } from "@/schemas";
import { Court } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar2 } from "@/components/ui/calendar2";
import { FileUpload } from "@/components/file-upload";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GoogleAddressSearch from "@/app/(protected)/admin/_components/GoogleAddressSearch";
import GoogleMapSection from "@/app/(protected)/admin/_components/GoogleMapSection";

interface EditCourtFormProps {
  court: Court | null;
  onSubmit: (data: any) => Promise<void>;
  coordinates: { lat: number; lng: number } | null;
  setCoordinates: (coords: { lat: number; lng: number } | null) => void;
  selectedAddress: { label: string; value: any } | null;
  setSelectedAddress: (address: { label: string; value: any } | null) => void;
  onClose: () => void;
  onDeleteImage: (url: string) => Promise<void>;
}

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

export function EditCourtForm({
  court,
  onSubmit,
  coordinates,
  setCoordinates,
  selectedAddress,
  setSelectedAddress,
  onClose,
  onDeleteImage,
}: EditCourtFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: court?.name || "",
      description: court?.description || "",
      price: court?.price.toString() || "",
      dates: (court?.dates as Date[]) || [],
      startTime: court?.startTime || "",
      endTime: court?.endTime || "",
      imageUrl: court?.imageUrl || [],
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit({
      ...court,
      ...values,
      address: selectedAddress?.label || court?.address,
      coordinates: coordinates || court?.coordinates,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex-1 overflow-y-auto"
      >
        <div className="flex gap-6 p-6">
          {/* Columna izquierda */}
          <div className="flex-1 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Cancha</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Ubicación</FormLabel>
              <GoogleAddressSearch
                selectedAddress={setSelectedAddress}
                setCoordinates={setCoordinates}
                initialAddress={court?.address}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio por Hora</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>

          {/* Columna central */}
          <div className="flex-1 space-y-4">
            <FormField
              control={form.control}
              name="dates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disponibilidad</FormLabel>
                  <Calendar2
                    mode="multiple"
                    selected={field.value}
                    onSelect={field.onChange}
                    className="rounded-md border"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de Inicio</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de Fin</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="flex-1 space-y-4">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imágenes de la Cancha</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {field.value.map((url, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={url}
                          alt={`Imagen de la cancha ${index + 1}`}
                          width={200}
                          height={150}
                          className="rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={async () => {
                            await onDeleteImage(url);
                            const newUrls = field.value.filter(
                              (_, i) => i !== index
                            );
                            field.onChange(newUrls);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <FileUpload
                      endpoint="ImageFile"
                      onChange={(urls) => {
                        // Limit to 3 images total
                        const currentUrls = field.value || [];
                        const newUrls = [...currentUrls, ...urls];
                        if (newUrls.length > 3) {
                          alert("Solo se permiten hasta 3 imágenes");
                          field.onChange(newUrls.slice(0, 3));
                        } else {
                          field.onChange(newUrls);
                        }
                      }}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="px-6 pb-6 flex justify-end gap-2 items-end w-full">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Guardar cambios</Button>
        </div>
      </form>
    </Form>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import GoogleAddressSearch from "./GoogleAddressSearch";
import { useEffect, useState } from "react";
import GoogleMapSection from "./GoogleMapSection";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/file-upload";
import Image from "next/image";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { canchasCourt } from "@/actions/canchas-actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Definir esquema de validación
const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    description: z.string().min(10, {
      message: "La descripción debe tener al menos 10 caracteres.",
    }),
    dates: z.array(z.date(), {
      required_error: "Por favor seleccione al menos una fecha.",
    }),
    startTime: z.string({
      required_error: "Por favor seleccione una hora de inicio.",
    }),
    endTime: z.string({
      required_error: "Por favor seleccione una hora de fin.",
    }),
    price: z.string().refine((val) => !isNaN(Number(val)), {
      message: "El precio debe ser un número válido.",
    }),
    imageUrl: z.string().min(1, { message: "La imagen es obligatoria." }),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "La hora de fin debe ser posterior a la hora de inicio.",
    path: ["endTime"],
  });

// Opciones de tiempo
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

export function CourtForm() {
  const router = useRouter();
  const { data: session } = useSession();

  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<{
    label: string;
    value: {
      description: string;
      place_id: string;
      reference: string;
    };
  } | null>(null);

  // console.log(selectedAddress?.label);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      dates: [],
      startTime: "",
      endTime: "",
      imageUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Asegúrate de que la sesión esté disponible
      if (!session) {
        throw new Error("No estás autenticado. Por favor, inicia sesión.");
      }

      const email = session.user.email; // Obtén el ID del usuario

      if (!email) {
        throw new Error("No se pudo obtener el correo electrónico del usuario");
      }
      console.log(session);
      const data = {
        name: values.name,
        address: selectedAddress?.label ?? "",
        description: values.description,
        dates: values.dates,
        startTime: values.startTime,
        endTime: values.endTime,
        imageUrl: values.imageUrl,
        coordinates:
          coordinates !== null ? { ...coordinates } : { lat: 0, lng: 0 },
        price: Number(values.price), // Convertir string a número
        email, // Agregar el ID del usuario aquí
      };

      await canchasCourt(data); // Envío de datos al backend
      toast.success("Cancha Creada con Éxito");
      window.location.reload();
    } catch (error) {
      toast.error("Un error ocurrió al crear la cancha.");
      console.error("Error al enviar el formulario:", error);
    }
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
      <div className="w-full md:w-1/2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Cancha</FormLabel>
                  <FormControl>
                    <Input placeholder="Cancha Principal" {...field} />
                  </FormControl>
                  <FormDescription>
                    Ingrese un nombre descriptivo para la cancha.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <GoogleAddressSearch
                selectedAddress={setSelectedAddress}
                setCoordinates={setCoordinates}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cancha de fútbol 5 con césped sintético..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Proporcione una descripción detallada de la cancha.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="dates"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fechas</FormLabel>
                    <Calendar
                      mode="multiple"
                      selected={field.value}
                      onSelect={field.onChange}
                      className="rounded-md border-2 border-gray-300 p-2"
                      disabled={(date) => date < new Date()}
                    />
                    <FormDescription>
                      Seleccione una o más fechas para reservar la cancha.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Hora de Inicio
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full p-2 border-2 border-gray-300 rounded-md">
                            <SelectValue placeholder="Seleccione una hora de inicio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Elija la hora de inicio para la cancha.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Hora de Fin
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full p-2 border-2 border-gray-300 rounded-md">
                            <SelectValue placeholder="Seleccione una hora de fin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Elija la hora de fin para la cancha.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio por Hora</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="50.00" {...field} />
                  </FormControl>
                  <FormDescription>
                    Ingrese el precio por hora de alquiler de la cancha.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {field.value ? (
                        <div className="w-500 h-500 relative">
                          <Image
                            src={field.value}
                            alt="Imagen subida"
                            width={540}
                            height={540}
                            className="w-540 h-500 object-cover rounded-md mb-2"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 z-10"
                            onClick={() => field.onChange("")} // Limpiar el campo de imagen
                          >
                            <X />
                          </button>
                        </div>
                      ) : (
                        <FileUpload
                          endpoint="ImageFile"
                          onChange={(url) => {
                            if (url) {
                              field.onChange(url);
                            }
                          }}
                        />
                      )}
                    </FormControl>
                    <div className="text-xs text-muted-foreground mt-4">
                      16:9 aspect ratio recommended
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full md:w-auto"
              onClick={() => console.log("Botón clickeado")}
            >
              Guardar Cancha
            </Button>
          </form>
        </Form>
      </div>

      <div className="w-full md:w-1/2 h-full">
        <div className="h-full md:w-[350px] lg:w-[450px] xl:w-[550px]">
          <GoogleMapSection coordinates={coordinates} />
        </div>
      </div>
    </div>
  );
}

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

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
}


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
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Registro de Cancha</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Formulario Principal - 7 columnas */}
            <div className="lg:col-span-7 space-y-6">
              {/* Información Básica */}
              <div className="bg-white rounded-lg border p-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Nombre de la Cancha</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: Cancha Principal" 
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mt-4">
                  <GoogleAddressSearch
                    selectedAddress={setSelectedAddress}
                    setCoordinates={setCoordinates}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel className="text-sm font-medium">Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe las características de la cancha"
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Precio */}
              <div className="bg-white rounded-lg border p-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Precio por Hora</FormLabel>
                      <FormControl>
                      <Input 
                        type="number" 
                        placeholder={formatPrice(50000)} // Mostrar el placeholder en formato de pesos colombianos
                        {...field}
                        className="h-10"
                      />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Imagen */}
              <div className="bg-white rounded-lg border p-4">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Imagen de la Cancha</FormLabel>
                      <FormControl>
                        {field.value ? (
                          <div className="relative rounded-lg overflow-hidden">
                            <Image
                              src={field.value}
                              alt="Imagen de la cancha"
                              width={540}
                              height={300}
                              className="w-full h-[350px] object-cover"
                            />
                            <button
                              type="button"
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              onClick={() => field.onChange("")}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed rounded-lg p-4">
                            <FileUpload
                              endpoint="ImageFile"
                              onChange={(url) => {
                                if (url) field.onChange(url);
                              }}
                            />
                          </div>
                        )}
                      </FormControl>
                      <FormDescription className="text-xs mt-2">
                        Formato recomendado: 16:9
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Mapa y Calendario - 5 columnas */}
            <div className="lg:col-span-5 space-y-6">
              {/* Mapa */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-4">Ubicación de la Cancha</h3>
                <div className="h-[300px] rounded-lg overflow-hidden">
                  <GoogleMapSection coordinates={coordinates} />
                </div>
              </div>

              {/* Calendario y Horarios */}
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium mb-4">Disponibilidad</h3>
                
                <FormField
                  control={form.control}
                  name="dates"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <Calendar
                        mode="multiple"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="border rounded-md"
                        classNames={{
                          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                          month: "space-y-4",
                          caption: "flex justify-center pt-1 relative items-center",
                          caption_label: "text-sm font-medium",
                          nav: "space-x-1 flex items-center",
                          nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity",
                          nav_button_previous: "absolute left-1",
                          nav_button_next: "absolute right-1",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex",
                          head_cell: "text-slate-500 rounded-md w-8 font-normal text-[0.8rem]",
                          row: "flex w-full mt-2",
                          cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-100",
                          day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
                          day_range_end: "day-range-end",
                          day_selected: "bg-slate-900 text-slate-50 hover:bg-slate-900 hover:text-slate-50 focus:bg-slate-900 focus:text-slate-50",
                          day_today: "bg-slate-100 text-slate-900",
                          day_outside: "text-slate-400 opacity-50",
                          day_disabled: "text-slate-400 opacity-50",
                          day_range_middle: "aria-selected:bg-slate-100 aria-selected:text-slate-900",
                          day_hidden: "invisible",
                        }}
                        disabled={(date) => date < new Date()}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Horarios */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Inicio</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Hora inicial" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
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
                        <FormLabel className="text-sm font-medium">Fin</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Hora final" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Botón de Submit */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
              >
                Guardar Cancha
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
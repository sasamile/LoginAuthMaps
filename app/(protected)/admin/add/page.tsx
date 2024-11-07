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
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/file-upload";
import Image from "next/image";
import { Clock, MapPin, X, Camera, DollarSign } from "lucide-react";
import { useSession } from "next-auth/react";
import { canchasCourt } from "@/actions/canchas-actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import GoogleMapSection from "../_components/GoogleMapSection";
import GoogleAddressSearch from "../_components/GoogleAddressSearch";
import { formSchema } from "@/schemas";
import { deleteImageFile } from "@/actions/uploadthing-actions";
import { Calendar2 } from "@/components/ui/calendar2";

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

export default function AddCourts() {
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
      imageUrl: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!session) {
        throw new Error("No estás autenticado. Por favor, inicia sesión.");
      }

      const email = session.user.email;
      if (!email) {
        throw new Error("No se pudo obtener el correo electrónico del usuario");
      }

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
        price: Number(values.price),
        email,
      };

      await canchasCourt(data);
      toast.success("Cancha Creada con Éxito");
      router.push("/admin/courts");
    } catch (error) {
      toast.error("Un error ocurrió al crear la cancha.");
      console.error("Error al enviar el formulario:", error);
    }
  }

  const handleDelete = async (url: string) => {
    await deleteImageFile(url);
  };

  return (
    <div className="min-h-screen ">
      <div className="mx-auto p-6">
        <div className="rounded-xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <MapPin className="w-8 h-8 text-blue-600" />
            Registro de Cancha
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Columna izquierda */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Información Básica */}
                  <div className="rounded-xl border p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-6 text-blue-900 dark:text-white">
                      Información Básica
                    </h3>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel className="text-sm font-semibold ">
                            Nombre de la Cancha
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: Cancha Principal"
                              {...field}
                              className="h-11 "
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="mb-6">
                      <label className="text-sm font-semibold  mb-2 block">
                        Ubicación
                      </label>
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
                          <FormLabel className="text-sm font-semibold ">
                            Descripción
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe las características de la cancha"
                              className="min-h-[120px] resize-none "
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Precio */}
                  <div className="rounded-xl border  p-6 shadow-sm ">
                    <h3 className="text-xl font-semibold mb-6 text-blue-900 dark:text-white flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                      Precio
                    </h3>

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold ">
                            Precio por Hora
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder={formatPrice(50000)}
                              {...field}
                              className="h-11   focus:border-blue-400 focus:ring-blue-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Imagen */}
                  <div className="rounded-xl border  p-6 shadow-sm ">
                    <h3 className="text-xl font-semibold mb-6 text-blue-900 dark:text-white flex items-center gap-2">
                      <Camera className="w-6 h-6 text-blue-600" />
                      Imagen de la Cancha
                    </h3>

                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            {field.value.length > 0 ? (
                              <div className="grid grid-cols-2 gap-4">
                                {field.value.map((url, index) => (
                                  <div
                                    key={index}
                                    className="relative rounded-xl overflow-hidden"
                                  >
                                    <Image
                                      src={url}
                                      alt={`Imagen de la cancha ${index + 1}`}
                                      width={540}
                                      height={300}
                                      className="w-full h-[350px] object-cover"
                                    />
                                    <button
                                      type="button"
                                      className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                                      onClick={async () => {
                                        await handleDelete(url);
                                        const updatedUrls = field.value.filter(
                                          (_, i) => i !== index
                                        );
                                        field.onChange(updatedUrls);
                                      }}
                                    >
                                      <X className="w-5 h-5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="border-2 border-dashed  rounded-xl p-8 text-center">
                                <FileUpload
                                  endpoint="ImageFile"
                                  onChange={(urls) => {
                                    field.onChange(urls);
                                  }}
                                />
                              </div>
                            )}
                          </FormControl>
                          <FormDescription className="text-sm mt-2 ">
                            Formato recomendado: 16:9
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Columna derecha */}
                <div className="lg:col-span-5 space-y-8">
                  {/* Mapa */}
                  <div className="rounded-xl border  p-6 shadow-sm ">
                    <h3 className="text-xl font-semibold mb-6 text-blue-900 dark:text-white flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-blue-600" />
                      Ubicación
                    </h3>
                    <div className="h-[439px] rounded-xl overflow-hidden w-full">
                      <GoogleMapSection coordinates={coordinates} />
                    </div>
                  </div>

                  <div className="rounded-xl border  p-6 shadow-sm  flex flex-col">
                    <h3 className="text-xl font-semibold mb-6 text-blue-900 dark:text-white flex items-center gap-2">
                      <Clock className="w-6 h-6 text-blue-600" />
                      Disponibilidad
                    </h3>
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name="dates"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Calendar2
                              mode="multiple"
                              selected={field.value}
                              onSelect={field.onChange}
                              className="rounded-xl   h-full"
                              disabled={(date) => date < new Date()}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Horarios */}
                    <div className="grid grid-cols-2 gap-6 mt-6">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold ">
                              Hora de Inicio
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11  ">
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
                            <FormLabel className="text-sm font-semibold ">
                              Hora de Fin
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11  ">
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

                  {/* Botón de Submit */}
                </div>
              </div>
              <div className="w-full flex justify-center">
                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Guardar Cancha
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

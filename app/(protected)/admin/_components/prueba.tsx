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
import { useState } from "react";
import GoogleMapSection from "./GoogleMapSection";
import { Calendar } from "@/components/ui/calendar";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  address: z.string().min(5, {
    message: "La dirección debe tener al menos 5 caracteres.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "El precio debe ser un número válido.",
  }),
});

interface Coordinates {
  lat: number;
  lng: number;
}

export function CourtForm() {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      price: "",
    },
  });

  interface GoogleMapSectionProps {
    coordinates: { lat: number; lng: number } | null;
    listing: any[]; // Add this line to define the listing prop
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const [date, setDate] = useState<Date | undefined>(new Date());
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
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />

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

            <Button type="submit" className="w-full md:w-auto">
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


{/**

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
import { useState } from "react";
import GoogleMapSection from "./GoogleMapSection";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  address: z.string().min(5, {
    message: "La dirección debe tener al menos 5 caracteres.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  dates: z.array(z.date(), {
    required_error: "Por favor seleccione al menos una fecha.",
  }),
  startTime: z.string({
    required_error: "Por favor seleccione una hora de inicio.",
  }),
  endTime: z
    .string({
      required_error: "Por favor seleccione una hora de fin.",
    })
    .refine((val) => {
      const startTime = z.string().parse(val); // parse val to get the startTime
      if (startTime && val <= startTime) {
        return false;
      }
      return true;
    }),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "El precio debe ser un número válido.",
  }),
});

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
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      price: "",
      dates: [],
      startTime: "",
      endTime: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
                      mode="multiple" // Permitir selección múltiple
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
                        defaultValue={field.value}
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
                        defaultValue={field.value}
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

            <Button type="submit" className="w-full md:w-auto">
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
} */}
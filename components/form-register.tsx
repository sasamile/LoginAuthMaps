"use client";
import React, { useState, useTransition } from "react";
import { RegisterSchema } from "@/lib/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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
// import { useRouter } from "next/navigation";
import { FileUpload } from "./file-upload";
import { File, X } from "lucide-react";
import { RegisterAction } from "@/actions/auth-actions";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Modal from "./Modal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function FormRegister() {
  const router = useRouter();

  const { data: session, status } = useSession();

  // const route = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isModal, setIsModal] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      apellido: "",
      archivo: "",
      email: "",
      isAdmin: false,
      name: "",
      numeroTelefono: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof RegisterSchema>) {
    try {
      // Validar campos según si es administrador
      if (values.isAdmin) {
        // Si es administrador, asegurarse de que todos los campos estén llenos
        const requiredFields = [
          "name",
          "apellido",
          "numeroTelefono",
          "email",
          "password",
          "archivo", // Asegúrate de que el archivo sea obligatorio
        ];
  
        const allFieldsFilled = requiredFields.every(
          (field) => values[field as keyof typeof values] !== ""
        );
  
        if (!allFieldsFilled) {
          setError("Todos los campos son obligatorios si eres administrador.");
          return; // Detener el envío si los campos no están llenos
        }
      } else {
        // Si no es administrador, limpiar el campo archivo
        values.archivo = ""; // Borrar el archivo
      }
  
      // Lógica para el registro
      console.log(values);
      startTransition(async () => {
        const response = await RegisterAction(values);
        console.log(response);
        if (response.error) {
          setError(response.error);
        } else {
          // Verifica el rol del usuario y redirige
          if (values.isAdmin) {
            setIsModal(true); // Mostrar el modal si es administrador
          } else {
            // Redirigir a la página de inicio de sesión si no es administrador
            router.push("/sign-in");
          }
        }
      });
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      setError("Error al crear el usuario. Inténtalo de nuevo.");
    }
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center py-14 ",
        form.watch("isAdmin") && "mt-20"
      )}
    >
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Registro
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Por favor, completa el formulario para registrarte.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex">
              <div className="w-1/2 p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Nombre</FormLabel>
                      <FormControl>
                        <Input
                          className="border-2 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md p-2"
                          placeholder="Tu nombre"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apellido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Apellido</FormLabel>
                      <FormControl>
                        <Input
                          className="border-2 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md p-2"
                          placeholder="Tu apellido"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numeroTelefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Número de Teléfono
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="border-2 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md p-2"
                          placeholder="Tu número de teléfono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          className="border-2 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md p-2"
                          placeholder="tuemail@ejemplo.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2 p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Contraseña
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-2 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md p-2"
                          type="password"
                          placeholder="*********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isAdmin"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <label className="flex items-center space-x-2">
                          <Input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            {...field}
                            value={field.value ? "true" : "false"}
                          />
                          <span className="text-gray-700">
                            ¿Es administrador?
                          </span>
                        </label>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <motion.div
                  initial={{ height: 0, opacity: 0 }} // Estado inicial
                  animate={
                    form.watch("isAdmin")
                      ? { height: "auto", opacity: 1 }
                      : { height: 0, opacity: 0 }
                  } // Animación al mostrar/ocultar
                  transition={{ duration: 0.3 }} // Duración de la transición
                >
                  <FormField
                    control={form.control}
                    name="archivo"
                    render={({ field }) => (
                      <FormItem hidden={!form.watch("isAdmin")}>
                        <FormLabel className="text-gray-700">Archivo</FormLabel>
                        <FormDescription>
                          Para mayor seguridad, por favor agregar el RUT de la
                          cancha a administrar.
                        </FormDescription>
                        <FormControl>
                          <div className="flex flex-col space-y-2">
                            {field.value && ( // Verifica si hay un archivo
                              <div className="flex items-center p-3 w-full bg-sky-100 border-sky-200 text-sky-700 rounded-md">
                                <File className="h-4 w-4 mr-2 flex-shrink-0 " />
                                <p className="text-xs line-clamp-1">
                                  {field.value}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    field.onChange(""); // Elimina el archivo
                                  }}
                                  className="ml-auto hover:opacity-75 transition"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                            {!field.value && ( // Mostrar FileUpload solo si no hay archivo
                              <FileUpload
                                endpoint="FileUploadthing" // Cambia esto según tu endpoint
                                onChange={(url) => {
                                  if (url) {
                                    field.onChange(url); // Actualiza el campo con la URL del archivo
                                  }
                                }}
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {error && (
                  <FormMessage className="text-red-500">{error}</FormMessage>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 mb-6">
              <Link
                href="/sign-in"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                ¿No tienes una cuenta? Inicia sesión
              </Link>
            </div>
            <div className="mt-4">
              {" "}
              {/* Añadido margen superior al botón */}
              <Button
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition duration-200"
              >
                Registrarse
              </Button>
            </div>
          </form>
        </Form>

        {form.watch("isAdmin") && isModal && (
          <>
            <Modal isModal={isModal} />
          </>
        )}
      </div>
    </div>
  );
}

export default FormRegister;

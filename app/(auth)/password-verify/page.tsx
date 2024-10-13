"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import { updatePHash } from "@/actions/password-actions";
import { useRouter } from "next/navigation";
import Image from "next/image";

const PasswordChangeSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

function PasswordVerifyPage({
  searchParams,
}: {
  searchParams: { email: string };
}) {
  const route = useRouter()
  // console.log(searchParams.email);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof PasswordChangeSchema>>({
    resolver: zodResolver(PasswordChangeSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof PasswordChangeSchema>) {
    try {
      setIsSubmitting(true);

      if(values.password === values.confirmPassword){
        const value = {
          "email":searchParams.email,
          "password":values.password
        }
        const res = await updatePHash(value);
        toast.success("Cambio Exitoso");
        route.push("/sign-in")
        setMessage("Tu contraseña ha sido actualizada.");
      }
       
       else {
        throw new Error("Error al actualizar la contraseña");
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      toast.error("Hubo un problema al cambiar la contraseña. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div>
    <div className="flex  h-screen">
      
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="flex items-center w-full h-full max-w-sm mx-auto lg:w-96">
        <div className="flex items-center justify-center min-h-screen ">
          <div className="bg-white p-14 rounded-lg shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Cambiar Contraseña
            </h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Nueva Contraseña
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="border-2 border-blue-300 w-[300px] focus:border-blue-500 focus:ring focus:ring-blue-200"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Confirmar Contraseña
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="border-2 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {message && (
                  <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                    {message}
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded"
                >
                  {isSubmitting ? "Cambiando..." : "Cambiar Contraseña"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
        </div>
      </div>
      <div className="relative flex-1 hidden w-0 lg:block">
        <Image
          src={"/img5.jpg"}
          alt="Login"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
    </div>
  );
}

export default PasswordVerifyPage;



"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordActions } from "@/actions/password-actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import { PasswordResetSchema } from "@/schemas";


function PasswordResetPage() {
  const route = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof PasswordResetSchema>>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof PasswordResetSchema>) {
    try {
      setIsSubmitting(true);
      console.log(values);
      const response = await PasswordActions(values);
      toast.success("Correo Enviado");
      route.push("/sign-in");
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("Error al enviar el correo");
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <div className="flex h-screen">
      <div className="w-full  flex items-center justify-center">
        <div className="p-14 rounded-lg w-full">
          <h2 className="text-2xl font-bold text-center  mb-6">
            Recuperar Contraseña
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input
                        className="border-2 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        placeholder="tu@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded"
              >
                {isSubmitting ? "Enviando..." : "Recuperar Contraseña"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetPage;

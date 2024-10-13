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
import { PasswordActions } from "@/actions/password-actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const PasswordResetSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

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
      console.log(values);
      const response = await PasswordActions(values);
      toast.success("Correo Enviado");
      route.push("/sign-in");
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <div className="flex h-screen">
        <div className="relative hidden lg:block w-1/2 h-full">
          <Image
            src="/img4.jpg"
            alt="Login"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="flex items-center justify-center min-h-screen ">
            <div className="bg-white p-14 rounded-lg w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
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
                        <FormLabel className="text-gray-700">
                          Correo Electrónico
                        </FormLabel>
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
                    {isSubmitting ? "Enviando..." : "Recuperar Contraseña"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetPage;

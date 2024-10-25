"use client";
import React, { useEffect, useState, useTransition } from "react";
import { LoginSchema } from "@/lib/zod";
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
import { loginAction } from "@/actions/auth-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";

function FormLogin() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role === "USER") {
        window.location.href = "/dashboard";
      } else if (session?.user?.role === "ADMIN") {
        window.location.href = "/admin";
      } else if (session?.user?.role === "SUPERUSER") {
        window.location.href = "/superadmin";
      }
    }
  }, [session, status, router]);

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    console.log(values);

    startTransition(async () => {
      const response = await loginAction(values);
      console.log(response);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Logged in successfully");
        // Forzar una actualización de la sesión después de iniciar sesión
        await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });
      }
    });
  }

  return (
    <div className="shadow-2xl dark:text-black">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar sesión
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Correo electrónico
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-2 w-[300px] border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      placeholder="shadcn"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      className="border-2 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      type="password"
                      placeholder="*********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col justify-between items-center mt-4 mb-6">
              <Button
                type="button"
                variant="link"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
                onClick={() => {
                  router.push("/password");
                  // You might want to redirect to a forgot password page or open a modal
                }}
              >
                ¿Has olvidado tu contraseña?
              </Button>
              <Link
                href="/sign-up"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                No tienes una cuenta? Registrate
              </Link>
            </div>

            <Button
              disabled={isPending}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default FormLogin;

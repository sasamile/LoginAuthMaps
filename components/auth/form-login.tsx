"use client";
import React, { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { loginAction } from "@/actions/auth-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { signIn, useSession } from "next-auth/react";
import { LoginSchema } from "@/schemas";
import { PasswordInput } from "@/components/ui/password-input";

function FormLogin() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { data: session, status } = useSession();
  const { isSubmitting, isValid } = form.formState;

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
    try {
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
    } catch (error) {}
  }

  return (
    <div className="">
      <div className="w-full max-w-md">
        <h2 className="text-3xl py-4 font-bold mt-6 text-center">
          Iniciar sesión
        </h2>
        <p className="select-none pb-4 text-center">
          No tienes una cuenta {""}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push("/sign-up")}
          >
            Regístrese
          </span>
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      className="border-[#525252] py-5"
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
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <PasswordInput
                      field={field}
                      isSubmitting={isSubmitting}
                      className="border-[#525252] py-5"
                    />
                  </FormControl>
                  <FormDescription className="text-[13.5px]">
                    La contraseña debe tener un mínimo de 8 caracteres,
                    incluyendo al menos 1 letra, 1 número y 1 carácter especial.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center mt-4 mb-6 ">
              <Link
                href="/password"
                className="text-sm  hover:text-blue-800 underline"
              >
                ¿Has olvidado tu contraseña?
              </Link>
            </div>

            <Button
              disabled={isPending}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded"
            >
              Enviar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default FormLogin;

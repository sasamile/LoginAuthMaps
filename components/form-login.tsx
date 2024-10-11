"use client";
import React, { useEffect, useState, useTransition } from "react";
import { LoginSchema } from "@/lib/zod";
import { useForm } from "react-hook-form";
import { string, z } from "zod";
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
import { signIn, useSession } from "next-auth/react";

function FormLogin({ isVerificada }: { isVerificada: boolean }) {
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

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.push("/");
    }
  }, [session]);

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    console.log(values);

    startTransition(async () => {
      const response = await loginAction(values);
      console.log(response);
      if (response.error) {
        setError(response.error);
      } else {
        window.location.href = "/admin";
      }
    });
  }

  // const handleGitHubSignIn = async () => {
  //   const result = await signIn("github", { redirect: false }); // Evitamos redirección automática para ver el resultado
  //   if (result?.error) {
  //     console.error("Error al iniciar sesión con GitHub:", result.error);
  //   } else {
  //     console.log("Iniciado sesión con GitHub", result);
  //     window.location.href = "/dashboard"; // Redirigir manualmente
  //   }
  // };

  // const handleGoogleSignIn = async () => {
  //   const result = await signIn("google", { redirect: false });
  //   if (result?.error) {
  //     console.error("Error al iniciar sesión con Google:", result.error);
  //   } else {
  //     console.log("Iniciado sesión con Google", result);
  //     window.location.href = "/dashboard";
  //   }
  // };

  return (
    <div className="shadow-2xl">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        {isVerificada && (
          <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 rounded-md flex items-center">
            <svg
              className="w-6 h-6 text-green-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <p className="text-green-700 font-medium">
              Your email has been successfully verified! You can now log in.
            </p>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="border-2 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
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
                  <FormLabel className="text-gray-700">Password</FormLabel>
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
            <div className="flex justify-between items-center mt-4 mb-6">
              <Button
                type="button"
                variant="link"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
                onClick={() => {
                  router.push("/password");
                  // You might want to redirect to a forgot password page or open a modal
                }}
              >
                Forgot password?
              </Button>
              <Link
                href="/sign-up"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Don't have an account? Sign up
              </Link>
            </div>
            {error && <FormMessage>{error}</FormMessage>}
            <Button
              disabled={isPending}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded"
            >
              Submit
            </Button>
          </form>
        </Form>
        {/* <div className="flex gap-4">
          <button onClick={handleGitHubSignIn}>
            Iniciar sesión con GitHub
          </button>
          <button onClick={handleGoogleSignIn}>
            Iniciar sesión con Google
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default FormLogin;

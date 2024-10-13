"use client"
import FormLogin from "@/components/form-login";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function LoginPage({ searchParams }: { searchParams: { verified: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "USER") {
      router.push("/dashboard");
    }else if(status === "authenticated" && session?.user?.role === "SUPERUSER"){
      router.push("/superadmin")
    }else if(status === "authenticated" && session?.user?.role === "ADMIN"){
      router.push("/admin")
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <Loading />;
  }


  const isVerificada = searchParams.verified === "true";
  return (
    <div>
      <div className="flex  h-screen">
        <div className="relative flex-1 hidden w-0 lg:block">
          <Image
            src={"/img1.jpg"}
            alt="Login"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="flex items-center w-full h-full max-w-sm mx-auto lg:w-96 justify-center">
            <FormLogin isVerificada={isVerificada} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

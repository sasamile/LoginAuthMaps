"use client"
import FormRegister from "@/components/form-register";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function RegisterPage() {
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
  return (
    <div className="flex h-screen">
      <div className="w-full lg:w-1/2 flex items-center justify-center pt-14 overflow-auto">
        <FormRegister />
      </div>
      
      <div className="relative hidden lg:block w-1/2 h-full overflow-hidden">
        <Image
          src="/img3.jpg"
          alt="Login"
          layout="fill"
          objectFit="cover"
          className="overflow-hidden"
          priority
        />
      </div>
    </div>
  );
}

export default RegisterPage;
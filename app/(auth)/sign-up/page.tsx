"use client"
import FormRegister from "@/components/form-register";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect } from "react";

function RegisterPage() {

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
import FormRegister from "@/components/form-register";
import Image from "next/image";
import React from "react";

function RegisterPage() {
  return (
    <div className="flex h-screen">
      <div className="w-full lg:w-1/2 flex items-center justify-center pt-14">
        <FormRegister />
      </div>
      
      <div className="relative hidden lg:block w-1/2 h-full">
        <Image
          src="/img3.jpg"
          alt="Login"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
    </div>
  );
}

export default RegisterPage;
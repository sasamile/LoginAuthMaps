"use client";

import AccountCreationStepper from "@/components/auth/account-creation-stepper";
import { useRouter } from "next/navigation";

function RegisterPage() {
  const router = useRouter();
  return (
    <div className=" dark:text-white h-full ">
      <div className=" xl:px-16 w-fit mx-auto">
        <h2 className="text-3xl py-4 font-bold ">Crea una cuenta</h2>
        <p className="select-none">
          Ya tienes una cuenta? {""}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push("/sign-in")}
          >
            Iniciar sesión
          </span>
        </p>
      </div>

      <AccountCreationStepper />
    </div>
  );
}
export default RegisterPage;

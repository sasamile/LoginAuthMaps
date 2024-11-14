import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import { Spotlight } from "./slipt";
import { oswald } from "@/lib/font";
import Link from "next/link";

function Hero() {
  return (
    <div className="relative isolate">
      <div className=" text-white text-center max-xl:py-16 pt-6">
        <Spotlight
          className="absolute -top-40 -right-[85%] md:-right-[65%] lg:-right-[60%] md:-top-20 rotate-6 animate-spotlight"
          fill="blue"
        />
        <h2
          className={cn(
            "w-[60%] mx-auto text-[80px] leading-[1] font-bold pt-12 bg-clip-text text-transparent bg-gradient-to-b dark:from-neutral-50 dark;to-neutral-300 bg-opacity-50 text-gray-900 dark:text-white",
            oswald.className
          )}
        >
          <span className="text-blue-500">CourtsMap </span>
          Reserva Fácil y Rápido en Villavicencio
        </h2>
        <p className="w-[50%] mx-auto  dark:text-gray-300  text-gray-900 py-12 leading-7">
          Encuentra las mejores canchas, Con CourtMap, reserva tus espacios
          favoritos en Villavicencio sin complicaciones y con total comodidad.
          Ahorra tiempo y asegúrate de tener el lugar ideal para tu Partidos,
          todo desde la palma de tu mano.
        </p>
        <Link href={"/sign-in"}>
          <Button className="bg-blue-500 animate-bounce text-black px-6 font-semibold hover:bg-blue-700 hover:text-white">
            Comenzar
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Hero;

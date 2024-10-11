import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

function Navbar() {
  return (
    <div className="bg-black/90 py-4">
      <div className="w-[95%] mx-auto  ">
        <div className="flex justify-between items-center  ">
          <div className="flex items-center gap-4">
            <Image
              src={"/logo.svg"}
              width={50}
              height={150}
              alt="logo de aplicacion"
              className="rounded-md"
            />
            <h2 className="text-3xl font-black text-white">CourtMaps</h2>
          </div>
          <div className="space-x-3">
            <Link href={"/sign-in"}>
              <Button className="bg-green-600 hover:bg-green-700">
                Sign-In
              </Button>
            </Link>
            <Link href={"/sign-up"}>
              <Button
                variant={"outline"}
                className="bg-transparent text-white border-none"
              >
                Sign-Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

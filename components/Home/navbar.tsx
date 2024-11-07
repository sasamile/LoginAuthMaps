"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "../ui/button";
import { Logo } from "../logo";

function Navbar() {
  const pathname = usePathname();
  return (
    <div>
      <div className="flex justify-between items-center px-12 py-4">
        <Logo hideText />
        <div className="dark:text-white space-x-12 ">
          <Link
            href={"/"}
            className={`${pathname === "/" && "text-blue-500"} `}
          >
            Inicio
          </Link>
          <Link
            href={"/promociones"}
            className={`${pathname === "/promociones" && "text-blue-500"} `}
          >
            Promociones
          </Link>
        </div>
        <div>
          <Link href={"/sign-in"}>
            <Button className="border-blue-500 border-2 bg-transparent hover:bg-inherit px-7 dark:text-white text-black ">
              Sign-in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

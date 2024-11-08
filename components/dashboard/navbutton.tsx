"use client";
import { Calendar, History, List } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserNav } from "@/app/(protected)/admin/_components/user-nav";
import { ModeToggle } from "../ui/modetoggle";

export default function NavButton() {
  const patname = usePathname();
  const navbar = [
    { label: "Disponibles", link: "/dashboard", icon: Calendar },
    { label: "Mis Reservas", link: "/dashboard/reservas", icon: List },
    { label: "Historial", link: "/dashboard/history", icon: History },
  ];

  return (
    <div className=" dark:border-gray-600 border-b-[0.5px]">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex justify-center items-center gap-4">
            <svg
              id="logo-70"
              width="50"
              height="30"
              viewBox="0 0 78 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {" "}
              <path
                d="M18.5147 0C15.4686 0 12.5473 1.21005 10.3934 3.36396L3.36396 10.3934C1.21005 12.5473 0 15.4686 0 18.5147C0 24.8579 5.14214 30 11.4853 30C14.5314 30 17.4527 28.7899 19.6066 26.636L24.4689 21.7737C24.469 21.7738 24.4689 21.7736 24.4689 21.7737L38.636 7.6066C39.6647 6.57791 41.0599 6 42.5147 6C44.9503 6 47.0152 7.58741 47.7311 9.78407L52.2022 5.31296C50.1625 2.11834 46.586 0 42.5147 0C39.4686 0 36.5473 1.21005 34.3934 3.36396L15.364 22.3934C14.3353 23.4221 12.9401 24 11.4853 24C8.45584 24 6 21.5442 6 18.5147C6 17.0599 6.57791 15.6647 7.6066 14.636L14.636 7.6066C15.6647 6.57791 17.0599 6 18.5147 6C20.9504 6 23.0152 7.58748 23.7311 9.78421L28.2023 5.31307C26.1626 2.1184 22.5861 0 18.5147 0Z"
                fill="#3b82f5ff"
              ></path>{" "}
              <path
                d="M39.364 22.3934C38.3353 23.4221 36.9401 24 35.4853 24C33.05 24 30.9853 22.413 30.2692 20.2167L25.7982 24.6877C27.838 27.8819 31.4143 30 35.4853 30C38.5314 30 41.4527 28.7899 43.6066 26.636L62.636 7.6066C63.6647 6.57791 65.0599 6 66.5147 6C69.5442 6 72 8.45584 72 11.4853C72 12.9401 71.4221 14.3353 70.3934 15.364L63.364 22.3934C62.3353 23.4221 60.9401 24 59.4853 24C57.0498 24 54.985 22.4127 54.269 20.2162L49.798 24.6873C51.8377 27.8818 55.4141 30 59.4853 30C62.5314 30 65.4527 28.7899 67.6066 26.636L74.636 19.6066C76.7899 17.4527 78 14.5314 78 11.4853C78 5.14214 72.8579 0 66.5147 0C63.4686 0 60.5473 1.21005 58.3934 3.36396L39.364 22.3934Z"
                fill="#3b82f5ff"
              ></path>{" "}
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              CourtMap
            </h1>
          </div>
          <nav className="flex space-x-4">
            {navbar.map((nav) => (
              <Link href={nav.link} key={nav.label}>
                <Button
                  variant={"ghost"}
                  className={`${
                    patname === nav.link
                      ? " text-black dark:text-white"
                      : " text-gray-500 dark:text-gray-500"
                  } bg-inherit hover:bg-inherit`}
                >
                  <nav.icon className="w-5 h-5" />
                  {nav.label}
                </Button>
              </Link>
            ))}
          </nav>
          <div className="flex justify-center items-center gap-4">
            <ModeToggle />

            <UserNav />
          </div>
        </div>
      </div>
    </div>
  );
}

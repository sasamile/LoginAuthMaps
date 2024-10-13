"use client"
import Link from "next/link";
import { Home, Users, UserCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="bg-secondary text-secondary-foreground w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <nav className="space-y-2">
        <Link
          href="/superadmin"
          className={cn("flex items-center space-x-2 px-4 py-2.5 rounded-lg transition duration-200 hover:bg-primary hover:text-primary-foreground ",pathname==="/superadmin" && "bg-primary text-white dark:text-black")}
        >
          <Home size={20} />
          <span>Inicio</span>
        </Link>
        <Link
          href="/superadmin/pending"
          className={cn("flex items-center space-x-2 px-4 py-2.5 rounded-lg transition duration-200 hover:bg-primary hover:text-primary-foreground ",pathname==="/superadmin/pending" && "bg-primary text-white dark:text-black")}
        >
          <Users size={20} />
          <span>Pendientes</span>
        </Link>
        <Link
          href="/superadmin/accepted"
          className={cn("flex items-center space-x-2 px-4 py-2.5 rounded-lg transition duration-200 hover:bg-primary hover:text-primary-foreground ",pathname==="/superadmin/accepted" && "bg-primary text-white dark:text-black")}
        >
          <UserCheck size={20} />
          <span>Aceptados</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;

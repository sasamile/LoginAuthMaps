// Barra de navegación optimizadaSuper Componente

"use client";

import { User, Moon, Sun, Home, Users, UserCheck, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "./logout-button";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NavbarSuper = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <span className="text-2xl font-bold text-primary">
            Admin Dashboard
          </span>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="-mr-2 flex md:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMenu}
                    aria-controls="mobile-menu"
                    aria-expanded={isMenuOpen}
                  >
                    <span className="sr-only">Abrir menú principal</span>
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetDescription>
                      <nav className="space-y-2">
                        <Link
                          href="/superadmin"
                          className={cn(
                            "flex items-center space-x-2 px-4 py-2.5 rounded-lg transition duration-200 hover:bg-primary hover:text-primary-foreground ",
                            pathname === "/superadmin" &&
                              "bg-primary text-white dark:text-black"
                          )}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Home size={20} />
                          <span>Inicio</span>
                        </Link>
                        <Link
                          href="/superadmin/pending"
                          className={cn(
                            "flex items-center space-x-2 px-4 py-2.5 rounded-lg transition duration-200 hover:bg-primary hover:text-primary-foreground ",
                            pathname === "/superadmin/pending" &&
                              "bg-primary text-white dark:text-black"
                          )}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Users size={20} />
                          <span>Pendientes</span>
                        </Link>
                        <Link
                          href="/superadmin/accepted"
                          className={cn(
                            "flex items-center space-x-2 px-4 py-2.5 rounded-lg transition duration-200 hover:bg-primary hover:text-primary-foreground ",
                            pathname === "/superadmin/accepted" &&
                              "bg-primary text-white dark:text-black"
                          )}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <UserCheck size={20} />
                          <span>Aceptados</span>
                        </Link>
                      </nav>
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarSuper;
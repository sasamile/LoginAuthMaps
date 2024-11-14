"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getUserByEmail } from "@/actions/user";
import LogoutButton from "@/components/logout-button";
import ProfileModal, { UserData } from "@/components/profilemodal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserNav() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<UserData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!session?.user?.email) {
          setError("No estás autenticado. Por favor, inicia sesión.");
          setIsLoading(false);
          return;
        }
        const userData = await getUserByEmail(session.user.email);
        setUser(userData);
        setEditedUser(userData);
      } catch (error) {
        console.error("Error loading user:", error);
        setError("Error al cargar los datos del usuario.");
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, [session]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === "b") {
        event.preventDefault(); // Prevenir el comportamiento por defecto
        setIsProfileModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={editedUser?.image ?? ""}
                alt={editedUser?.name}
              />
              <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">
                {editedUser?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {editedUser?.name} {editedUser?.lastname}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {editedUser?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={openProfileModal}
              className="cursor-pointer"
            >
              Perfil
              <DropdownMenuShortcut>⌃B</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="w-full"
            onClick={() => signOut({ callbackUrl: "/sign-in" })}
          >
            <div className="w-full">
              <LogoutButton />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}

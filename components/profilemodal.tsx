"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Loader2 } from "lucide-react";
import { getUserByEmail, patchUser } from "@/actions/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { uploadFile } from "@/actions/uploadthing-actions";
import { toast } from "sonner";

export interface UserData {
  id: string;
  email: string;
  name: string;
  lastname: string;
  phone: string | null;
  image: string | null;
  isAdmin: boolean | null;
  isActive: boolean | null;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

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
    if (isOpen) {
      loadUser();
    }
  }, [session, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setEditedUser((prev) =>
          prev ? { ...prev, image: reader.result as string } : null
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async () => {
    if (!editedUser) return;

    try {
      setIsLoading(true);

      // Handle image upload if a new image is selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const response = await uploadFile(formData);

        if (response?.success && response.fileUrl) {
          await patchUser(editedUser);
          setEditedUser(null);
          setImageFile(null);
          setIsLoading(false);
        } else {
          throw new Error("Failed to upload image");
        }
      }
      setUser(editedUser);
      setIsEditing(false);
      toast.success("Perfil actualizado exitosamente");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary">
            Perfil de Usuario
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : user && editedUser ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-primary">
                    <AvatarImage
                      src={editedUser.image ?? ""}
                      alt={editedUser.name}
                    />
                    <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">
                      {editedUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="image-upload"
                    className="absolute bottom-0 right-0 p-2 bg-primary rounded-full shadow-lg cursor-pointer hover:bg-primary/90 transition-colors duration-200 group-hover:opacity-100 opacity-0"
                  >
                    <Pencil className="w-5 h-5 text-primary-foreground" />
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={!isEditing}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-600"
                    >
                      Nombre
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={editedUser.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="lastname"
                      className="text-sm font-medium text-gray-600"
                    >
                      Apellido
                    </Label>
                    <Input
                      id="lastname"
                      name="lastname"
                      value={editedUser.lastname}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-600"
                  >
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-600"
                  >
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={editedUser.phone || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Editar Perfil
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedUser(user);
                          setImageFile(null);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Guardar Cambios
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default ProfileModal;

"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle } from "lucide-react"; // Iconos para mejor feedback visual.

interface ModalInterface {
  isModal: boolean;
}

function Modal({ isModal }: ModalInterface) {
  const router = useRouter();

  return (
    <div>
      <Dialog open={isModal}>
        <DialogContent className="bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader className="flex items-center space-x-2">
            <AlertTriangle className="text-yellow-500" size={24} />
            <DialogTitle className="text-2xl font-semibold">
              Espera la validación del Super Admin
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gray-600">
            Tu registro ha sido enviado para revisión. Un Super Admin revisará
            tu información y el archivo PDF proporcionado. Recibirás una
            notificación una vez que tu cuenta haya sido habilitada.
          </DialogDescription>
          <div className="mt-4 flex justify-center items-center">
            <Button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              onClick={() => router.push("/sign-in")}
            >
              <CheckCircle className="mr-2" size={20} />
              Entendido
            </Button>
          </div>
     
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Modal;

"use client";

import Link from "next/link";
import { CourtList } from "../_components/CourtList";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function CourtsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Mis Canchas</h2>
        <Link href={"/admin/add"}>
          <Button className="flex justify-center items-center gap-4">
            <Plus size={15} />
            Agregar Cancha
          </Button>
        </Link>
      </div>

      <CourtList />
    </div>
  );
}

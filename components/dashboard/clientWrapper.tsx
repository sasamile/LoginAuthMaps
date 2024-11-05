"use client";
import { fetchCourts } from "@/actions/canchas-actions";
import Filtercourts from "@/components/dashboard/filtercourts";
import NavButton from "@/components/dashboard/navbutton";
import { Court } from "@prisma/client";
import React, { useEffect, useState } from "react";
import ListCourtsfilter from "./listCourtsfilter";


interface ClientWrapperProps {
  initialCanchas: Court[];
}
function ClientWrapper({ initialCanchas }: ClientWrapperProps) {
  const [filteredCanchas, setFilteredCanchas] = useState(initialCanchas);
  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <NavButton />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar con filtros */}
            <Filtercourts
              canchas={initialCanchas}
              onFilter={setFilteredCanchas}
            />

            {/* Lista de canchas */}
            <ListCourtsfilter canchas={filteredCanchas} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientWrapper;

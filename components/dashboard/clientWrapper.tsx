"use client";
import { fetchCourts } from "@/actions/canchas-actions";
import Filtercourts from "@/components/dashboard/filtercourts";
import NavButton from "@/components/dashboard/navbutton";
import { Court } from "@prisma/client";
import React, { useEffect, useState } from "react";
import ListCourtsfilter from "./listCourtsfilter";
import useStore from "@/hooks/state-modal";

interface ClientWrapperProps {
  initialCanchas: Court[];
}
function ClientWrapper({ initialCanchas }: ClientWrapperProps) {
  const [filteredCanchas, setFilteredCanchas] = useState(initialCanchas);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  return (
    <div className="">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          

    
            <Filtercourts
              canchas={initialCanchas}
              onFilter={setFilteredCanchas}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
        

          {/* Lista de canchas */}
          <ListCourtsfilter
            canchas={filteredCanchas}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
}

export default ClientWrapper;

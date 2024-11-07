"use client";

import { getreservas } from "@/actions/reservation-actions";
import CourtListReserve, {
  Reservation,
} from "@/components/reservas/courtlist-reserve";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

function ReservasPage() {
  const { data: session } = useSession();
  const [reserverAll, setReserverAll] = useState<Reservation[]>();
  const [error, setError] = useState<string | null>(null);

  const Reserves = async () => {
    if (!session?.user.email) {
      setError("No estás autenticado. Por favor, inicia sesión.");
      return;
    }
    const res = await getreservas(session?.user.email);
    if (res) {
      // Transform the data to match the Reservation type
      const transformedReserves: Reservation[] = res.map((item) => ({
        ...item,
        court: {
          ...item.court,
          coordinates: JSON.stringify(item.court.coordinates), // Convert JsonValue to string
        },
      }));
      setReserverAll(transformedReserves);
    } else {
      setError("No se encontraron reservas.");
    }
  };
  useEffect(() => {
    if (session) {
      Reserves();
    }
  }, [session]);

  console.log(reserverAll);

  return (
    <div>
      <CourtListReserve reservas={reserverAll} />
    </div>
  );
}

export default ReservasPage;

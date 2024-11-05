"use client";

import { CourtList } from "../_components/CourtList";
export default function CourtsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Mis Canchas</h2>
      </div>

      <CourtList />
    </div>
  );
}

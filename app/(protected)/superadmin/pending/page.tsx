import { PendingAdminsTable } from "@/components/PendingAdminsTable";



export default function PendingAdminsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Administradores Pendientes</h1>
      <PendingAdminsTable />
    </div>
  );
}
import { AcceptedAdminsTable } from "@/components/AcceptedAdminsTable";




export default function AcceptedAdminsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Administradores Aceptados</h1>
      <AcceptedAdminsTable/>
    </div>
  );
}
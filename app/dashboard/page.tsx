// app/page.tsx
import { db } from "@/lib/db";
import ClientWrapper from "./_components/ClientWrapper";

export default async function Home() {
  const canchas = await db.court.findMany();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">
        Dashboard de Canchas Deportivas
      </h1>
      
        <ClientWrapper initialCanchas={canchas} />
    </main>
  );
}

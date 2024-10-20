import CanchasCarousel from "@/components/CanchasCarousel";
import CanchasSection from "@/components/CanchasSection";
import InfoSection from "@/components/infoSection";
import Navbar from "@/components/navbar";
import ClientWrapper from "./dashboard/_components/ClientWrapper";
import { db } from "@/lib/db";

export default async function Home() {
  const canchas = await db.court.findMany();
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100">
      <Navbar />
      <CanchasCarousel />
      <InfoSection />
      {/* <CanchasSection /> */}
      <div className="w-[90%] mx-auto mt-12">
      <ClientWrapper initialCanchas={canchas} />
      </div>

    </main>
  );
}

{
  /* <Navbar /> */
}

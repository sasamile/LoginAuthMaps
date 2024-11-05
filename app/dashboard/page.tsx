import ClientWrapper from "@/components/dashboard/clientWrapper";
import { db } from "@/lib/db";

async function DashboardPage() {
  const canchas = await db.court.findMany();
  return <ClientWrapper initialCanchas={canchas} />;
}

export default DashboardPage;

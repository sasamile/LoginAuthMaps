import Hero from "@/components/Home/hero";
import Navbar from "@/components/Home/navbar";


export default function Home() {
  return (
    <div className="h-full dark:bg-black overflow-hidden relative w-full">
      <Navbar />
      <Hero />
    </div>
  );
}

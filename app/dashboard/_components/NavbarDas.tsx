import Link from "next/link";
import { UserNav } from "@/app/(protected)/admin/_components/user-nav";

const NavbarDas = () => {
  return (
    <nav className="bg-primary text-primary-foreground ">
      <div className=" flex justify-between container mx-auto px-4 py-2">
        <Link href="/" legacyBehavior passHref>
          <h1 className="font-bold">Canchas Deportivas</h1>
        </Link>
        <div className="text-black">
          <UserNav />
        </div>
      </div>
    </nav>
  );
};

export default NavbarDas;

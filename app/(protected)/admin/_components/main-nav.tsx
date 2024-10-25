"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/admin"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/admin" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Panel
      </Link>
      <Link
        href="/admin/courts"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/admin/courts"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Mis Canchas
      </Link>
      <Link
        href="/admin/bookings"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/admin/bookings"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Reservas
      </Link>
      <Link
        href="/admin/reports"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/admin/reports"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Reportes
      </Link>
    </nav>
  );
}

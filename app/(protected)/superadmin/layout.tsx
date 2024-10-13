import { ThemeProvider } from "@/components/theme-provider";
import NavbarSuper from "@/components/NavbarSuper";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <NavbarSuper />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

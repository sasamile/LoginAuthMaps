"use client";

import Loading from "@/components/Loading";
import LogoutButton from "@/components/logout-button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <Loading />;
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f0f0",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
          Admin Dashboard
        </h1>
        <p style={{ fontSize: "18px", color: "#666" }}>
          Welcome, {session.user.name}!
        </p>
        <LogoutButton />

      </div>
    </div>
  );
}

export default AdminPage;
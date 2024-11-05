"use client";
import React from "react";
import { MainNav } from "./_components/main-nav";

import { UserNav } from "./_components/user-nav";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import { ModeToggle } from "@/components/ui/modetoggle";

function layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }
  return (
    <div className="hidden flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default layout;


import CanchasCarousel from "@/components/auth/CanchasCarousel";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="flex  h-screen ">
        <div className="relative flex-1 hidden w-0 lg:block">
          <CanchasCarousel />
        </div>
        <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="flex items-center w-full h-full max-w-sm mx-auto  justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default layout;

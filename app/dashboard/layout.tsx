import React from "react";
import NavbarDas from "./_components/NavbarDas";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavbarDas />
      {children}
    </div>
  );
}

export default layout;

"use client";

import { Navbar } from "./_components/navbar";

const ProtectedLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="container flex size-full flex-col items-center gap-y-10 pt-6">
      <Navbar />
      <div className="w-full">{children}</div>
    </div>
  );
};

export default ProtectedLayout;

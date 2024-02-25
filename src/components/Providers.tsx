"use client";

import { ThemeProvider } from "next-themes";
import React, { PropsWithChildren } from "react";

import { Toaster } from "./ui/sonner";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
      <Toaster position="top-center" richColors duration={5000} closeButton />
    </ThemeProvider>
  );
};

export default Providers;

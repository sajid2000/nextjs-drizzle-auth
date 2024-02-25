"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import UserMenu from "@/components/nav/UserMenu";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex w-full items-center justify-between rounded-xl bg-muted p-4 shadow-sm">
      <div className="flex gap-2">
        <Button asChild variant={pathname === "/profile" ? "default" : "outline"}>
          <Link href="/profile">Profile</Link>
        </Button>
        <Button asChild variant={pathname === "/admin" ? "default" : "outline"}>
          <Link href="/admin">Admin</Link>
        </Button>
        <Button asChild variant={pathname === "/settings" ? "default" : "outline"}>
          <Link href="/settings">Settings</Link>
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserMenu />
      </div>
    </nav>
  );
};

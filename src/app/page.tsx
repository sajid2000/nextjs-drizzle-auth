import { Poppins } from "next/font/google";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getServerUser } from "@/lib/nextauth";
import { cn } from "@/lib/utils";

import LoginButton from "./auth/_components/LoginButton";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default async function Home() {
  const user = await getServerUser();

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <div className="space-y-6 text-center">
        <h1 className={cn("text-6xl font-semibold text-white drop-shadow-md", font.className)}>🔐 Auth</h1>
        <p className="text-lg text-white">A simple authentication service</p>
        <div>
          {user ? (
            <Button asChild>
              <Link href="/admin">Dashboard</Link>
            </Button>
          ) : (
            <LoginButton asChild>
              <Button variant="secondary" size="lg">
                Sign in
              </Button>
            </LoginButton>
          )}
        </div>
      </div>
    </main>
  );
}

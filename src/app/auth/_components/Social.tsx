"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/constants";

const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex w-full items-center gap-x-2 pt-4">
        <Button size="lg" className="w-full" variant="outline" onClick={() => onClick("google")}>
          {/* <GitHubLogoIcon className="size-5" /> */}
          Google
        </Button>
        <Button size="lg" className="w-full" variant="outline" onClick={() => onClick("github")}>
          {/* <GitHubLogoIcon className="size-5" /> */}
          Github
        </Button>
      </div>
      <p className="text-center text-sm text-muted-foreground">OR CONTINUE WITH EMAIL</p>
    </div>
  );
};

export default Social;

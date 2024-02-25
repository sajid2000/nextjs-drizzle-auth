"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import Social from "./Social";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface Props {
  children: React.ReactNode;
  headerLabel: string;
  bottomButtonLabel: string;
  bottomButtonHref: string;
  showSocial?: boolean;
}

const AuthCard = ({ children, headerLabel, bottomButtonLabel, bottomButtonHref, showSocial }: Props) => {
  return (
    <Card className="min-w-[400px] shadow-md">
      <CardHeader className="items-center justify-center">
        <h1 className={cn("text-3xl font-semibold", font.className)}>Logo</h1>
        <p className="text-sm text-muted-foreground">{headerLabel}</p>
        {showSocial && <Social />}
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="justify-center">
        <Button variant="link" className="font-normal" size="sm" asChild>
          <Link href={bottomButtonHref}>{bottomButtonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthCard;

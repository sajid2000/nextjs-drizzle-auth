import { NextResponse } from "next/server";

import { getServerUser } from "@/lib/nextauth";

export async function GET() {
  const user = await getServerUser();

  if (user?.role === "Admin") {
    return new NextResponse(null, { status: 200 });
  }

  return new NextResponse(null, { status: 403 });
}

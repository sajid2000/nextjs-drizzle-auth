"use server";

import { getServerUser } from "@/lib/nextauth";

export const admin = async () => {
  const user = await getServerUser();

  if (user?.role === "Admin") {
    return { success: "Allowed Server Action!" };
  }

  return { error: "Forbidden Server Action!" };
};

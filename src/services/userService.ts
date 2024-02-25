import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import * as dbTable from "@/lib/db/schema";
import ValidationError from "@/lib/errors/ValidationError";

export const getUserByEmail = async (email: string) => {
  try {
    return await db.query.users.findFirst({ where: eq(dbTable.users.email, email) });
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    return await db.query.users.findFirst({ where: eq(dbTable.users.id, id) });
  } catch {
    return null;
  }
};

export const getAccountByUserId = async (userId: string) => {
  try {
    return await db.query.accounts.findFirst({
      where: eq(dbTable.accounts.userId, userId),
    });
  } catch {
    return null;
  }
};

export const createUser = async (data: Omit<typeof dbTable.users.$inferInsert, "id">) => {
  const { email, name, password } = data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new ValidationError({ email: ["Email already in use!"] });
  }

  const res = await db
    .insert(dbTable.users)
    .values({ name, email, password: bcrypt.hashSync(password, 10) })
    .returning();

  return res[0];
};

export const updateUser = async (userId: string, data: Partial<typeof dbTable.users.$inferInsert>) => {
  const res = await db.update(dbTable.users).set(data).where(eq(dbTable.users.id, userId)).returning();

  return res[0];
};

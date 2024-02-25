import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import * as dbTable from "@/lib/db/schema";

type TokenCreatePayload = { email: string; token: string; expires: Date };

// password reset token

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    return await db.query.passwordResetTokens.findFirst({
      where: eq(dbTable.passwordResetTokens.token, token),
    });
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    return await db.query.passwordResetTokens.findFirst({
      where: eq(dbTable.passwordResetTokens.email, email),
    });
  } catch {
    return null;
  }
};

export const createPasswordResetToken = async ({ email, token, expires }: TokenCreatePayload) => {
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await deletePasswordResetToken(existingToken.id);
  }

  const res = await db
    .insert(dbTable.passwordResetTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return res[0];
};

export const deletePasswordResetToken = async (id: string) => {
  return db.delete(dbTable.passwordResetTokens).where(eq(dbTable.passwordResetTokens.id, id));
};

// email verification token

export const getVerificationTokenByToken = async (token: string) => {
  try {
    return await db.query.verificationTokens.findFirst({
      where: eq(dbTable.verificationTokens.token, token),
    });
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    return await db.query.verificationTokens.findFirst({
      where: eq(dbTable.verificationTokens.email, email),
    });
  } catch {
    return null;
  }
};

export const createVerificationToken = async ({ email, token, expires }: TokenCreatePayload) => {
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await deleteVerificationToken(existingToken.id);
  }

  const res = await db
    .insert(dbTable.verificationTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return res[0];
};

export const deleteVerificationToken = async (id: string) => {
  return db.delete(dbTable.verificationTokens).where(eq(dbTable.verificationTokens.id, id));
};

// two factor confirmation

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    return await db.query.twoFactorConfirmations.findFirst({
      where: eq(dbTable.twoFactorConfirmations.userId, userId),
    });
  } catch {
    return null;
  }
};

export const createTwoFactorConfirmation = async (userId: string) => {
  const res = await db.insert(dbTable.twoFactorConfirmations).values({ userId }).returning();

  return res[0];
};

export const deleteTwoFactorConfirmation = async (id: string) => {
  return db.delete(dbTable.twoFactorConfirmations).where(eq(dbTable.twoFactorConfirmations.id, id));
};

// two factor otp

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    return await db.query.twoFactorTokens.findFirst({
      where: eq(dbTable.twoFactorTokens.token, token),
    });
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    return await db.query.twoFactorTokens.findFirst({
      where: eq(dbTable.twoFactorTokens.email, email),
    });
  } catch {
    return null;
  }
};

export const createTwoFactorToken = async ({ email, token, expires }: TokenCreatePayload) => {
  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await deleteTwoFactorToken(existingToken.id);
  }

  const res = await db
    .insert(dbTable.twoFactorTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return res[0];
};

export const deleteTwoFactorToken = async (id: string) => {
  return db.delete(dbTable.twoFactorTokens).where(eq(dbTable.twoFactorTokens.id, id));
};

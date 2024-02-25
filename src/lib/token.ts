import crypto from "crypto";

import { v4 } from "uuid";

import { createPasswordResetToken, createTwoFactorToken, createVerificationToken } from "../services/tokenService";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 1 * 60 * 1000);

  return createTwoFactorToken({ email, expires, token });
};

export const generatePasswordResetToken = async (email: string) => {
  const token = v4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  return createPasswordResetToken({ email, token, expires });
};

export const generateVerificationToken = async (email: string) => {
  const token = v4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  return createVerificationToken({ email, token, expires });
};

import bcrypt from "bcryptjs";

import HttpError from "@/lib/errors/HttpError";
import ValidationError from "@/lib/errors/ValidationError";
import { sendPasswordResetEmail, sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { generatePasswordResetToken, generateTwoFactorToken, generateVerificationToken } from "@/lib/token";
import { LoginPayload, RegisterPayload } from "@/lib/validators/auth";
import {
  createTwoFactorConfirmation,
  deletePasswordResetToken,
  deleteTwoFactorConfirmation,
  deleteTwoFactorToken,
  deleteVerificationToken,
  getPasswordResetTokenByToken,
  getTwoFactorConfirmationByUserId,
  getTwoFactorTokenByEmail,
  getVerificationTokenByToken,
} from "@/services/tokenService";
import { createUser, getUserByEmail, updateUser } from "@/services/userService";

export const register = async (payload: RegisterPayload) => {
  await createUser(payload);

  const verificationToken = await generateVerificationToken(payload.email);
  console.log(verificationToken.token);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);
};

export const confirmEmail = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    throw new HttpError("Token does not exist!");
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    throw new HttpError("Token has expired!");
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    throw new ValidationError({ email: ["Email does not exist!"] });
  }

  await updateUser(existingUser.id, { emailVerified: new Date() });

  await deleteVerificationToken(existingToken.id);
};

export const login = async (payload: LoginPayload) => {
  const { email, password, code } = payload;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    throw new ValidationError({ email: ["Email does not exist!"] });
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: true, message: "Confirmation email sent!" } as const;
  }

  if (!bcrypt.compareSync(password, existingUser.password)) {
    return { success: false, error: "Invalid credentials!" } as const;
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        throw new ValidationError({ code: ["Invalid code!"] });
      }

      if (twoFactorToken.token !== code) {
        throw new ValidationError({ code: ["Invalid code!"] });
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        throw new ValidationError({ code: ["Code expired!"] });
      }

      await deleteTwoFactorToken(twoFactorToken.id);

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      if (existingConfirmation) {
        await deleteTwoFactorConfirmation(existingConfirmation.id);
      }

      await createTwoFactorConfirmation(existingUser.id);
    } else {
      const existingTwoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (existingTwoFactorToken) {
        if (new Date(existingTwoFactorToken.expires) < new Date()) {
          await deleteTwoFactorToken(existingTwoFactorToken.id);
        } else {
          return { success: true, message: "Enter two factor code!", twoFactor: true } as const;
        }
      }

      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { success: true, message: "Enter two factor code!", twoFactor: true } as const;
    }
  }
};

export const requestResetPassword = async (email: string) => {
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    throw new ValidationError({ email: ["Email does not exist!"] });
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);
};

export const saveNewPassword = async (token: string, password: string) => {
  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    throw new HttpError("Invalid token!");
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    throw new HttpError("Token has expired!");
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    throw new ValidationError({ email: ["Email does not exist!"] });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await updateUser(existingUser.id, { password: hashedPassword });

  await deletePasswordResetToken(existingToken.id);
};

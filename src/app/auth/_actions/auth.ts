"use server";

import { AuthError } from "next-auth";

import HttpError from "@/lib/errors/HttpError";
import ValidationError from "@/lib/errors/ValidationError";
import { signIn, signOut } from "@/lib/nextauth";
import {
  LoginPayload,
  LoginSchema,
  NewPasswordPayload,
  NewPasswordSchema,
  RegisterPayload,
  RegisterSchema,
  ResetPasswordPayload,
  ResetPasswordSchema,
} from "@/lib/validators/auth";
import { confirmEmail, login, register, requestResetPassword, saveNewPassword } from "@/services/authService";

export const logoutAction = async () => {
  await signOut({ redirect: false });
};

export const registerAction = async (formData: RegisterPayload) => {
  try {
    const validatedFields = RegisterSchema.safeParse(formData);

    if (!validatedFields.success) {
      throw new ValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const { email, name, password } = validatedFields.data;

    await register({ email, name, password });

    return { success: true, message: "Confirmation email sent!" } as const;
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, error: error.message, fields: error.fields } as const;
    }

    if (error instanceof HttpError) {
      return { success: false, error: error.message } as const;
    }

    throw error;
  }
};

export const confirmEmailAction = async (token: string) => {
  try {
    await confirmEmail(token);

    return { success: true, message: "Email verified!" } as const;
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, error: error.message, fields: error.fields } as const;
    }

    if (error instanceof HttpError) {
      return { success: false, error: error.message } as const;
    }

    throw error;
  }
};

export const loginAction = async (formData: LoginPayload) => {
  const validatedFields = LoginSchema.safeParse(formData);

  if (!validatedFields.success) {
    throw new ValidationError(validatedFields.error.flatten().fieldErrors);
  }

  const { email, password, code } = validatedFields.data;

  try {
    const res = await login({ email, password, code });

    if (res) return res;
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, error: error.message, fields: error.fields } as const;
    }

    if (error instanceof HttpError) {
      return { success: false, error: error.message } as const;
    }

    throw error;
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true, message: "Login successfull!", twoFactor: false } as const;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid credentials!" } as const;
        default:
          return { success: false, error: "Something went wrong!" } as const;
      }
    }

    throw error;
  }
};

export const requestResetPasswordAction = async (formData: ResetPasswordPayload) => {
  try {
    const validatedFields = ResetPasswordSchema.safeParse(formData);

    if (!validatedFields.success) {
      throw new ValidationError(validatedFields.error.flatten().fieldErrors);
    }

    await requestResetPassword(validatedFields.data.email);

    return { success: true, message: "Reset email sent!" } as const;
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, error: error.message, fields: error.fields } as const;
    }

    if (error instanceof HttpError) {
      return { success: false, error: error.message } as const;
    }

    throw error;
  }
};

export const newPasswordAction = async (formData: NewPasswordPayload, token?: string | null) => {
  try {
    if (!token) {
      throw new HttpError("Missing token!");
    }

    const validatedFields = NewPasswordSchema.safeParse(formData);

    if (!validatedFields.success) {
      throw new ValidationError(validatedFields.error.flatten().fieldErrors);
    }

    await saveNewPassword(token, validatedFields.data.password);

    return { success: true, message: "Password updated!" } as const;
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, error: error.message, fields: error.fields } as const;
    }

    if (error instanceof HttpError) {
      return { success: false, error: error.message } as const;
    }

    throw error;
  }
};

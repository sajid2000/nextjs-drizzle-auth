export const DEFAULT_LOGIN_REDIRECT = "/";

export const AUTH_URI = {
  error: "/auth/error",
  signIn: "/auth/sign-in",
  signUp: "/auth/sign-up",
  resetPassword: "/auth/reset-password",
  newPassword: "/auth/new-password",
  confirmEmail: "/auth/confirm-email",
} as const;

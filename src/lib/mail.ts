import { Resend } from "resend";

import env from "@/env";

import { AUTH_URI } from "./constants";

const resend = new Resend(env.RESEND_API_KEY);
// const resend = {
//   emails: { send: ({}: any) => {} },
// };

const domain = env.NEXT_PUBLIC_APP_URL;
const mailFrom = env.MAIL_FROM;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: mailFrom,
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}${AUTH_URI.newPassword}?token=${token}`;

  await resend.emails.send({
    from: mailFrom,
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}${AUTH_URI.confirmEmail}?token=${token}`;

  await resend.emails.send({
    from: mailFrom,
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};

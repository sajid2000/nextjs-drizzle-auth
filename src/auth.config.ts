import { NextAuthConfig } from "next-auth";

import { AUTH_URI } from "./lib/constants";

export default {
  pages: {
    signIn: AUTH_URI.signIn,
    error: AUTH_URI.error,
  },
  providers: [],
} satisfies NextAuthConfig;

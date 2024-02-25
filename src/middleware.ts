import NextAuth from "next-auth";

import authConfig from "./auth.config";
import { AUTH_URI, DEFAULT_LOGIN_REDIRECT } from "./lib/constants";

const authRoutes = Object.values(AUTH_URI);
const publicRoutes = ["/"];

export const { auth: middleware } = NextAuth({
  ...authConfig,
  callbacks: {
    authorized: async ({ auth, request }) => {
      const { nextUrl } = request;

      const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
      const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
      const isAuthRoute = authRoutes.includes(nextUrl.pathname as any);

      if (isApiAuthRoute) {
        return true;
      }

      if (isAuthRoute) {
        if (auth?.user) {
          return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return true;
      }

      if (!auth?.user && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
          callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);

        return Response.redirect(new URL(`${AUTH_URI.signIn}?callbackUrl=${encodedCallbackUrl}`, nextUrl));
      }

      return true;
    },
  },
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const { auth: middleware } = NextAuth(authConfig);

const publicRoutes = [
  "/api/uploadthing",
  "/api/auth/verify-email",
  "/password-verify",
  "/api/auth/password-verify",
  "/sign-in",
  "/sign-up",
  "/password",
  "/",
];

export default middleware((req) => {
  const { nextUrl, auth } = req;
  const isLoggein = !!auth?.user;

  //Proteger Rutas
  if (!publicRoutes.includes(nextUrl.pathname) && !isLoggein) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }
  return NextResponse.next();
});

// ... existing code ...
export const config = {
  matcher: ["/((?!.*\\..*|_next|api/uploadthing).*)", "/", "/(api|trpc)(.*)"],
};
// ... existing code ...

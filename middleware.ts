import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT_ADMIN,
  DEFAULT_LOGIN_REDIRECT_USER,
  publicRoutes,
} from "./routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl?.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiRoute) {
    return undefined;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      if (req.auth?.user.role === "USER") {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT_USER, req.url));
      } else if (req.auth?.user.role === "ADMIN") {
        return Response.redirect(
          new URL(DEFAULT_LOGIN_REDIRECT_ADMIN, req.url)
        );
      }
    }
    return undefined;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/sign-in", nextUrl));
  }

  return undefined;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.*\\..*|_next|api/uploadthing).*)", "/", "/(api|trpc)(.*)"],
};

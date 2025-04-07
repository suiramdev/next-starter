import { getSessionCookie } from "better-auth/cookies";
import {
  NextResponse,
  type NextFetchEvent,
  type NextMiddleware,
  type NextRequest,
} from "next/server";

export interface AuthMiddlewareOptions {
  publicRoutes?: string[];
  redirectTo?: string;
}

/**
 * This is the middleware for the auth in next.js.
 * It is used to protect users from accessing protected routes without being logged in.
 *
 * @param options - The options for the middleware.
 * @param nextMiddleware - The next middleware to be called.
 */
export function withAuthMiddleware(
  options: AuthMiddlewareOptions,
  nextMiddleware?: NextMiddleware
) {
  const redirectTo = options.redirectTo ?? "/";

  return async function middleware(req: NextRequest, event: NextFetchEvent) {
    const { pathname } = req.nextUrl;

    const isProtectedRoute = !options.publicRoutes?.includes(pathname);

    const sessionCookie = getSessionCookie(req);

    if (isProtectedRoute && !sessionCookie) {
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }

    return nextMiddleware ? nextMiddleware(req, event) : NextResponse.next();
  };
}

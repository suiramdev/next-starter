import { getSessionCookie } from "better-auth/cookies";
import {
	type NextFetchEvent,
	type NextRequest,
	NextResponse,
} from "next/server";

const isSignInRoute = (pathname: string) => {
	return ["/sign-in", "/sign-up"].includes(pathname);
};

const isProtectedRoute = (pathname: string) => {
	return !["/sign-in", "/sign-up"].includes(pathname);
};

export function proxy(req: NextRequest, _event: NextFetchEvent) {
	const { pathname } = req.nextUrl;

	const sessionCookie = getSessionCookie(req);

	/**
	 * If the user is not signed in and on a protected route, redirect to the sign in page.
	 */
	if (isProtectedRoute(pathname) && !sessionCookie) {
		return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
	}

	/**
	 * If the user is signed in and on a sign in route, redirect to the home page.
	 */
	if (isSignInRoute(pathname) && sessionCookie) {
		return NextResponse.redirect(new URL("/", req.nextUrl));
	}

	console.log("sessionCookie", sessionCookie);
	console.log("pathname", pathname);

	return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - files with .png extension
		 *
		 * Note: With basePath: "/admin", the matcher is relative to the basePath.
		 * So "/" matches "/admin" and "/:path*" matches "/admin/:path*"
		 * We explicitly include "/" to ensure the root path is matched.
		 */
		"/",
		"/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png$).*)",
	],
};

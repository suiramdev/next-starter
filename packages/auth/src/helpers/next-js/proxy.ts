import { getSessionCookie } from "better-auth/cookies";
import {
	type NextFetchEvent,
	type NextRequest,
	NextResponse,
} from "next/server";

export interface AuthProxyOptions {
	publicRoutes?: string[];
	redirectTo?: string;
}

/**
 * This is the proxy for the auth in next.js.
 * It is used to protect users from accessing protected routes without being logged in.
 *
 * @param options - The options for the proxy.
 * @param nextProxy - The next proxy to be called.
 */
export function withAuthProxy(
	options: AuthProxyOptions,
	nextProxy?: (
		req: NextRequest,
		event: NextFetchEvent,
	) => Promise<NextResponse>,
) {
	const redirectTo = options.redirectTo ?? "/";

	return async function proxy(req: NextRequest, event: NextFetchEvent) {
		const { pathname } = req.nextUrl;

		const isProtectedRoute = !options.publicRoutes?.includes(pathname);

		const sessionCookie = getSessionCookie(req);

		if (isProtectedRoute && !sessionCookie) {
			const url = req.nextUrl.clone();
			url.pathname = redirectTo;
			return NextResponse.redirect(url);
		}

		return nextProxy ? nextProxy(req, event) : NextResponse.next();
	};
}

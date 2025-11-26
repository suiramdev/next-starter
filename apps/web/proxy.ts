import { withAuthProxy } from "@repo/auth/helpers/next-js/proxy";

export default withAuthProxy({
	publicRoutes: ["/sign-in", "/sign-up"],
	redirectTo: "/sign-in",
});

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

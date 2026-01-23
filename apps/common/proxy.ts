import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
	const response = NextResponse.next();

	// Get the origin from the request
	const origin = request.headers.get("origin") ?? "";

	// Determine the allowed origin
	let allowedOrigin: string | null = null;

	if (origin) {
		// Check if the origin is in the allowed list
		const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(",") ?? [];
		if (allowedOrigins.includes(origin)) {
			allowedOrigin = origin;
		} else if (process.env.NODE_ENV === "development") {
			// In development, allow the request origin if present
			// This is necessary when credentials are included
			allowedOrigin = origin;
		}
	}

	// Only set CORS headers if we have an allowed origin
	if (allowedOrigin) {
		response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
		response.headers.set("Access-Control-Allow-Credentials", "true");
	}

	response.headers.set(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, OPTIONS",
	);
	response.headers.set(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization",
	);

	// Handle preflight requests
	if (request.method === "OPTIONS") {
		return new NextResponse(null, { status: 204, headers: response.headers });
	}

	return response;
}

// Apply middleware only to API routes
export const config = {
	matcher: ["/api/:path*"],
};

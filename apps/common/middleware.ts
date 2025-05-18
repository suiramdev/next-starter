import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Get the origin from the request
  const origin = request.headers.get("origin") ?? "";
  
  // Check if the origin is allowed
  if (process.env.CORS_ALLOWED_ORIGINS?.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  } else if (process.env.NODE_ENV === "development") {
    // In development, allow all origins as a fallback
    response.headers.set("Access-Control-Allow-Origin", "*");
  }
  
  response.headers.set(
    "Access-Control-Allow-Methods", 
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set( "Access-Control-Allow-Headers", 
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  
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
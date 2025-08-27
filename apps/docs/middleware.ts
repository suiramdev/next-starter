import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(
      new URL("/getting-started/introduction/overview", req.url),
    );
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

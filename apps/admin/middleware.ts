import { NextResponse } from "next/server";
import { withAuthMiddleware } from "@repo/auth/helpers/next-js/middleware";

export default withAuthMiddleware(
  {
    publicRoutes: ["/sign-in", "/sign-up"],
    redirectTo: "/sign-in",
  },
  (req) => {
    // Custom middleware to redirect the user to the dashboard page if they are authenticated
    // on authentication routes or root route
    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  }
);

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

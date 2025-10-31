import { SignJWT } from "jose";
import { auth } from "../../server";
import { env } from "@repo/env/server";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * Generates a JWT token for Zero authentication from the current session.
 * The token includes the user ID as the 'sub' (subject) claim.
 *
 * @param cookies - Next.js request cookies
 * @returns A JWT token string, or null if no valid session exists
 */
export async function generateZeroToken(
  cookies: ReadonlyRequestCookies
): Promise<string | null> {
  // Get the session from better-auth
  // Convert cookies to a string format that better-auth expects
  const cookieHeader = cookies
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const session = await auth.api.getSession({
    headers: {
      cookie: cookieHeader,
    },
  });

  if (!session?.user?.id) {
    return null;
  }

  // Generate JWT token for Zero
  // Zero expects the userID to match the 'sub' field in the JWT
  const secretKey = env.ZERO_AUTH_SECRET;
  if (!secretKey) {
    throw new Error("ZERO_AUTH_SECRET must be set");
  }

  const secret = new TextEncoder().encode(secretKey);

  const token = await new SignJWT({
    sub: session.user.id,
    userId: session.user.id,
    email: session.user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h") // Token expires in 24 hours
    .sign(secret);

  return token;
}

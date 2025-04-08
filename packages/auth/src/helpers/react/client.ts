import { createAuthClient } from "better-auth/react";
// import { env } from "@repo/env";

/**
 * This is the client for the auth service.
 * It is used to interact with the auth service on the client side.
 *
 * @see https://www.better-auth.com/docs/concepts/client
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL,
});

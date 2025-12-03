import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { adminClient, anonymousClient } from "better-auth/client/plugins";
import { createAuthClient as createBetterAuthClient } from "better-auth/react";

/**
 * Creates an auth client for the auth service.
 * Apps must provide their own baseURL from their environment variables.
 *
 * @param baseURL - The base URL for the Better Auth API (e.g., from NEXT_PUBLIC_BETTER_AUTH_URL)
 * @returns A configured Better Auth client instance
 *
 * @example
 * ```ts
 * const authClient = createAuthClient(process.env.NEXT_PUBLIC_BETTER_AUTH_URL!);
 * ```
 *
 * @see https://www.better-auth.com/docs/concepts/client
 */
export function createAuthClient(baseURL: string) {
	return createBetterAuthClient({
		baseURL,
		plugins: [convexClient(), adminClient(), anonymousClient()],
	});
}

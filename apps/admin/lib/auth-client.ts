import { createAuthClient } from "@repo/convex/helpers/auth-client";

/**
 * Shared auth client instance for the admin app.
 * This ensures a single instance is used across the entire application.
 */
export const authClient = createAuthClient(
	process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "",
);


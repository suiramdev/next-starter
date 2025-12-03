"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { createAuthClient } from "@repo/convex/helpers/auth-client";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL ?? "", {
	// Optionally pause queries until the user is authenticated
	expectAuth: true,
});

const authClient = createAuthClient(process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "");

export function ConvexProvider({ children }: { children: ReactNode }) {
	return (
		<ConvexBetterAuthProvider client={convex} authClient={authClient}>
			{children}
		</ConvexBetterAuthProvider>
	);
}

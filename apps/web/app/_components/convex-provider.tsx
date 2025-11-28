"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL ?? "", {
	// Set to false to allow setup mutation before authentication
	// Individual mutations/queries should handle their own auth requirements
	expectAuth: false,
});

export function ConvexProvider({ children }: { children: ReactNode }) {
	return (
		<ConvexBetterAuthProvider client={convex} authClient={authClient}>
			{children}
		</ConvexBetterAuthProvider>
	);
}

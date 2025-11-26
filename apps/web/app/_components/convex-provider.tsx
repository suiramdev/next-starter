"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL ?? "", {
	// Set to false to allow setup mutation before authentication
	// Individual mutations/queries should handle their own auth requirements
	expectAuth: false,
});

const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryKeyHashFn: convexQueryClient.hashFn(),
			queryFn: convexQueryClient.queryFn(),
		},
	},
});

convexQueryClient.connect(queryClient);

export function ConvexProvider({ children }: { children: ReactNode }) {
	return (
		<ConvexBetterAuthProvider client={convex} authClient={authClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</ConvexBetterAuthProvider>
	);
}


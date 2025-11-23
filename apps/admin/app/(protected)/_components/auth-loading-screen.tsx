"use client";

import { authClient } from "@repo/auth/helpers/react/client";
import { Spinner } from "@repo/ui/registry/new-york-v4/ui/spinner";
import type { ReactNode } from "react";

/**
 * Component that shows a loading screen while authentication is initializing.
 * This prevents queries from executing before auth headers are ready.
 */
export function AuthLoadingScreen({ children }: { children: ReactNode }) {
	const { isPending } = authClient.useSession();

	if (isPending) {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<Spinner className="size-8" />
				</div>
			</div>
		);
	}

	return <>{children}</>;
}

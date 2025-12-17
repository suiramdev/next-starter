import { getToken } from "@convex-dev/better-auth/nextjs";
import { api } from "@repo/convex/_generated/api";
import { createAuth } from "@repo/convex/domains/auth/setup";
import { Separator } from "@repo/ui/registry/new-york-v4/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@repo/ui/registry/new-york-v4/ui/sidebar";
import { preloadQuery } from "convex/nextjs";
import { Sidebar } from "@/features/layout/components/sidebar";

export default async function ProtectedLayout({
	children,
}: React.PropsWithChildren) {
	const token = await getToken(createAuth);
	const hasSpotifyAccountQuery = await preloadQuery(
		api.domains.spotify.queries.hasSpotifyAccount,
		{},
		{ token: token ?? undefined },
	);

	return (
		<SidebarProvider>
			<Sidebar preloadedHasSpotifyAccount={hasSpotifyAccountQuery} />
			<SidebarInset>
				<header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mx-2 data-[orientation=vertical]:h-4"
						/>
					</div>
				</header>
				<div className="flex flex-1 flex-col overflow-hidden">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

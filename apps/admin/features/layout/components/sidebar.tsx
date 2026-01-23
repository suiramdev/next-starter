import { getToken } from "@convex-dev/better-auth/nextjs";
import { api } from "@repo/convex/_generated/api";
import { createAuth } from "@repo/convex/domains/auth/setup";
import {
	Sidebar as SidebarComponent,
	SidebarContent,
	SidebarFooter,
} from "@repo/ui/registry/new-york-v4/ui/sidebar";
import { preloadQuery } from "convex/nextjs";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

export async function Sidebar() {
	const token = await getToken(createAuth);
	const preloadedQuery = await preloadQuery(
		api.domains.users.queries.getUser,
		{},
		{ token },
	);

	return (
		<SidebarComponent variant="inset">
			<SidebarContent>
				<NavMain />
			</SidebarContent>
			<SidebarFooter>
				<NavUser preloadedQuery={preloadedQuery} />
			</SidebarFooter>
		</SidebarComponent>
	);
}

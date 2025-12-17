import type { api } from "@repo/convex/_generated/api";
import {
	Sidebar as SidebarComponent,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "@repo/ui/registry/new-york-v4/ui/sidebar";
import type { Preloaded } from "convex/react";
import { NavMain } from "./nav-main";
import { NavPlaylist } from "./nav-playlist";
import { NavUser } from "./nav-user";

interface SidebarProps {
	preloadedHasSpotifyAccount: Preloaded<
		typeof api.domains.spotify.queries.hasSpotifyAccount
	>;
}

export async function Sidebar({ preloadedHasSpotifyAccount }: SidebarProps) {
	return (
		<SidebarComponent variant="inset">
			<SidebarHeader>
				<h2 className="px-2 font-semibold text-lg">Blind Test</h2>
			</SidebarHeader>
			<SidebarContent>
				<NavMain />
				<NavPlaylist preloadedHasSpotifyAccount={preloadedHasSpotifyAccount} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</SidebarComponent>
	);
}

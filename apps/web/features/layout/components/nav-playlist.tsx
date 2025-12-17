"use client";

import type { api } from "@repo/convex/_generated/api";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/registry/new-york-v4/ui/card";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
} from "@repo/ui/registry/new-york-v4/ui/sidebar";
import type { Preloaded } from "convex/react";
import { usePreloadedQuery } from "convex/react";
import { LinkSpotifyButton } from "@/features/spotify/components/link-spotify-button";

interface NavPlaylistProps {
	preloadedHasSpotifyAccount: Preloaded<
		typeof api.domains.spotify.queries.hasSpotifyAccount
	>;
}

export function NavPlaylist({ preloadedHasSpotifyAccount }: NavPlaylistProps) {
	const hasSpotifyAccount = usePreloadedQuery(preloadedHasSpotifyAccount);

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Playlists</SidebarGroupLabel>
			<SidebarGroupContent>
				{!hasSpotifyAccount && (
					<Card className="border-none bg-secondary py-4">
						<CardHeader className="px-4">
							<CardTitle>Connect with Spotify</CardTitle>
							<CardDescription>
								Connect your account to choose a playlist for your rooms.
							</CardDescription>
						</CardHeader>
						<CardContent className="px-4">
							<LinkSpotifyButton className="w-full" />
						</CardContent>
					</Card>
				)}
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

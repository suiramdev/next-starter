"use client";

import { useConvexAction } from "@convex-dev/react-query";
import { api } from "@repo/convex/_generated/api";
import {
	PlaylistCard,
	PlaylistCardSkeleton,
} from "@repo/ui/registry/web/playlist-card";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as React from "react";

interface SpotifyPlaylist {
	id: string;
	name: string;
	images?:
		| { url: string; height?: number | null; width?: number | null }[]
		| null;
	tracks: { total: number };
	owner?: { display_name?: string | null };
}

interface PlaylistSelectionSectionProps {
	selectedPlaylistId?: string;
	searchQuery: string;
	onSelect: (
		id: string,
		name: string,
		image?: string,
		author?: string | null,
		totalTracks?: number,
	) => void;
}

export function PlaylistSelectionSection({
	selectedPlaylistId,
	searchQuery,
	onSelect,
}: PlaylistSelectionSectionProps) {
	const getUserPlaylists = useConvexAction(
		api.domains.spotify.actions.getUserPlaylists,
	);
	const searchPlaylists = useConvexAction(
		api.domains.spotify.actions.searchPlaylists,
	);

	// Load user's playlists by default
	const { data: userPlaylists, isLoading: isLoadingUserPlaylists } = useQuery({
		queryKey: ["user-playlists"],
		queryFn: () => getUserPlaylists({ limit: 50 }),
		enabled: !searchQuery.trim(),
	});

	const {
		data: searchResults,
		mutate: searchMutate,
		isPending: isSearching,
	} = useMutation({
		mutationFn: searchPlaylists,
	});

	// Trigger search when searchQuery changes
	React.useEffect(() => {
		if (searchQuery.trim()) {
			searchMutate({ query: searchQuery });
		}
	}, [searchQuery, searchMutate]);

	// Determine which playlists to show
	const playlists = searchQuery.trim() ? searchResults : userPlaylists;
	const isPending = searchQuery.trim() ? isSearching : isLoadingUserPlaylists;

	const handleSelect = (playlist: SpotifyPlaylist) => {
		onSelect(
			playlist.id,
			playlist.name,
			playlist.images?.[0]?.url,
			playlist.owner?.display_name ?? null,
			playlist.tracks.total,
		);
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="overflow-x-auto">
				<div className="flex gap-4 pb-2">
					{isPending ? (
						Array.from({ length: 5 }).map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
							<PlaylistCardSkeleton key={i} />
						))
					) : playlists && playlists.length > 0 ? (
						playlists.map((playlist) => (
							<PlaylistCard
								key={playlist.id}
								name={playlist.name}
								image={playlist.images?.[0]?.url}
								ownerName={playlist.owner?.display_name ?? undefined}
								trackCount={playlist.tracks.total}
								isSelected={selectedPlaylistId === playlist.id}
								onClick={() => handleSelect(playlist)}
							/>
						))
					) : searchQuery ? (
						<div className="text-muted-foreground text-sm">
							No playlists found.
						</div>
					) : (
						<div className="text-muted-foreground text-sm">
							Search for playlists to get started.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

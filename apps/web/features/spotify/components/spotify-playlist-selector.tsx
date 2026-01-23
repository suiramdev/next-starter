"use client";

import { useConvexAction } from "@convex-dev/react-query";
import { useSize } from "@radix-ui/react-use-size";
import { api } from "@repo/convex/_generated/api";
import {
	DashedSelector,
	DashedSelectorContent,
	DashedSelectorPlaceholder,
	DashedSelectorTrigger,
	DashedSelectorValue,
	SearchableList,
	SearchableListGroup,
	SearchableListItem,
} from "@repo/ui/registry/web/dashed-selector";
import { DiscIcon } from "@repo/ui/registry/web/icons";
import { SpotifyPlaylistItem } from "@repo/ui/registry/web/spotify-playlist-item";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { useDebouncedCallback } from "../../../hooks/use-debounce";

interface SpotifyPlaylist {
	id: string;
	name: string;
	images?: { url: string; height?: number | null; width?: number | null }[] | null;
	tracks: { total: number };
	owner?: { display_name?: string | null };
}

interface InitialPlaylist {
	name: string;
	image?: string;
	author?: string;
	totalTracks?: number;
}

interface SpotifyPlaylistSelectorProps {
	value?: string;
	initialPlaylist?: InitialPlaylist;
	onValueChange?: (
		value: string,
		name?: string,
		image?: string,
		author?: string | null,
		totalTracks?: number,
	) => void;
	id?: string;
}

export function SpotifyPlaylistSelector({
	initialPlaylist,
	onValueChange,
	id,
}: SpotifyPlaylistSelectorProps) {
	const [open, setOpen] = useState(false);
	const [selectedPlaylist, setSelectedPlaylist] =
		useState<SpotifyPlaylist | null>(null);

	// Use initial playlist data if no selection has been made yet
	const displayPlaylist = selectedPlaylist
		? {
				name: selectedPlaylist.name,
				image: selectedPlaylist.images?.[0]?.url,
				totalTracks: selectedPlaylist.tracks.total,
				ownerName: selectedPlaylist.owner?.display_name ?? undefined,
			}
		: initialPlaylist
			? {
					name: initialPlaylist.name,
					image: initialPlaylist.image,
					totalTracks: initialPlaylist.totalTracks ?? 0,
					ownerName: initialPlaylist.author,
				}
			: null;
	const triggerRef = useRef<HTMLButtonElement>(null);
	const triggerSize = useSize(triggerRef.current);

	const searchPlaylists = useConvexAction(
		api.domains.spotify.actions.searchPlaylists,
	);
	const {
		data: playlists,
		mutate,
		isPending,
	} = useMutation({
		mutationFn: searchPlaylists,
	});

	const debouncedSearch = useDebouncedCallback((query: string) => {
		if (query.trim()) {
			mutate({ query });
		}
	}, 300);

	const handleSelect = useCallback(
		(playlist: SpotifyPlaylist) => {
			setSelectedPlaylist(playlist);
			onValueChange?.(
				playlist.id,
				playlist.name,
				playlist.images?.[0]?.url,
				playlist.owner?.display_name ?? null,
				playlist.tracks.total,
			);
			setOpen(false);
		},
		[onValueChange],
	);

	// Transform raw Spotify API playlist to SpotifyPlaylistItem format
	const toPlaylistItemProps = (playlist: SpotifyPlaylist) => ({
		name: playlist.name,
		image: playlist.images?.[0]?.url,
		totalTracks: playlist.tracks.total,
		ownerName: playlist.owner?.display_name ?? undefined,
	});

	return (
		<DashedSelector open={open} onOpenChange={setOpen}>
			<DashedSelectorTrigger id={id} ref={triggerRef}>
				{displayPlaylist ? (
					<DashedSelectorValue>
						<SpotifyPlaylistItem playlist={displayPlaylist} />
					</DashedSelectorValue>
				) : (
					<DashedSelectorPlaceholder
						icon={<DiscIcon className="size-5 text-muted-foreground" />}
					>
						Choose a playlist
					</DashedSelectorPlaceholder>
				)}
			</DashedSelectorTrigger>

			<DashedSelectorContent style={{ width: triggerSize?.width }}>
				<SearchableList
					onSearch={debouncedSearch}
					placeholder="Search playlists..."
					emptyMessage="No playlists found."
					isLoading={isPending}
				>
					{playlists && playlists.length > 0 && (
						<SearchableListGroup heading="Playlists">
							{playlists.map((playlist) => (
								<SearchableListItem
									key={playlist.id}
									value={playlist.id}
									onSelect={() => handleSelect(playlist)}
								>
									<SpotifyPlaylistItem
										playlist={toPlaylistItemProps(playlist)}
									/>
								</SearchableListItem>
							))}
						</SearchableListGroup>
					)}
				</SearchableList>
			</DashedSelectorContent>
		</DashedSelector>
	);
}

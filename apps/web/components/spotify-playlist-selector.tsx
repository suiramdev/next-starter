"use client";

import { useConvexAction } from "@convex-dev/react-query";
import { useSize } from "@radix-ui/react-use-size";
import { api } from "@repo/convex/_generated/api";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@repo/ui/registry/new-york-v4/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@repo/ui/registry/new-york-v4/ui/popover";
import { Spinner } from "@repo/ui/registry/new-york-v4/ui/spinner";
import {
	ChevronsUpDownIcon,
	DiscIcon,
	MusicIcon,
} from "@repo/ui/registry/web/icons";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useDebouncedCallback } from "../hooks/use-debounce";

interface SpotifyPlaylist {
	id: string;
	name: string;
	images: { url: string; height?: number | null; width?: number | null }[];
	tracks: { total: number };
	owner?: { display_name?: string | null };
}

interface SpotifyPlaylistSelectorProps {
	value?: string;
	onValueChange?: (value: string, name?: string, image?: string) => void;
	id?: string;
}

export function SpotifyPlaylistSelector({
	onValueChange,
	id,
}: SpotifyPlaylistSelectorProps) {
	const [open, setOpen] = useState(false);
	const [selectedPlaylist, setSelectedPlaylist] =
		useState<SpotifyPlaylist | null>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const triggerSize = useSize(triggerRef.current);

	const searchPlaylists = useConvexAction(api.actions.spotify.searchPlaylists);
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
			onValueChange?.(playlist.id, playlist.name, playlist.images[0]?.url);
			setOpen(false);
		},
		[onValueChange],
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					id={id}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="h-full w-full justify-between overflow-hidden text-left"
					ref={triggerRef}
				>
					{selectedPlaylist ? (
						<SpotifyPlaylistItem playlist={selectedPlaylist} />
					) : (
						<span className="text-muted-foreground">
							Search for a playlist...
						</span>
					)}
					<ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="p-0"
				align="start"
				style={{ width: triggerSize?.width }}
			>
				<Command shouldFilter={false}>
					<CommandInput
						placeholder="Search playlists..."
						onValueChange={debouncedSearch}
					/>
					<CommandList>
						<CommandEmpty className="flex items-center justify-center py-6 text-center text-sm">
							{isPending ? <Spinner /> : <span>No playlists found.</span>}
						</CommandEmpty>
						{playlists && playlists.length > 0 && (
							<CommandGroup heading="Playlists">
								{playlists.map((playlist) => (
									<CommandItem
										key={playlist.id}
										value={playlist.id}
										onSelect={() => handleSelect(playlist)}
										className="flex items-center gap-3"
									>
										<SpotifyPlaylistItem playlist={playlist} />
									</CommandItem>
								))}
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

function SpotifyPlaylistItem({ playlist }: { playlist: SpotifyPlaylist }) {
	return (
		<div className="flex min-w-0 gap-2">
			{playlist.images[0] ? (
				<Image
					src={playlist.images[0].url}
					alt={playlist.name}
					className="rounded object-cover"
					width={32}
					height={32}
				/>
			) : (
				<div className="relative aspect-square size-8 rounded-xs bg-primary/20">
					<DiscIcon className="absolute inset-0 m-auto size-4 text-muted-foreground" />
				</div>
			)}
			<div className="flex min-w-0 flex-col">
				<span className="truncate font-medium">{playlist.name}</span>
				<span className="truncate text-muted-foreground text-xs">
					{playlist.tracks.total} tracks
					{playlist.owner?.display_name && ` • ${playlist.owner.display_name}`}
				</span>
			</div>
		</div>
	);
}

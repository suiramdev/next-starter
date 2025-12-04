"use client";

import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import { Badge } from "@repo/ui/registry/new-york-v4/ui/badge";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import {
	CircleDotIcon,
	DiscIcon,
	MusicIcon,
	PlayIcon,
	TrophyIcon,
} from "@repo/ui/registry/web/icons";
import {
	type Preloaded,
	useMutation,
	usePreloadedQuery,
	useQuery,
} from "convex/react";
import Image from "next/image";
import { useState } from "react";
import { LinkSpotifyButton } from "@/features/spotify/components/link-spotify-button";
import { SpotifyPlaylistSelector } from "@/features/spotify/components/spotify-playlist-selector";
import { authClient } from "@/lib/auth-client";

interface RoomStatusProps {
	preloadedQuery: Preloaded<typeof api.domains.rooms.queries.getRoom>;
	roomId: Id<"rooms">;
}

const STATUS_CONFIG = {
	waiting: {
		label: "Waiting for the host",
		icon: CircleDotIcon,
		variant: "secondary" as const,
	},
	playing: {
		label: "Game in progress",
		icon: MusicIcon,
		variant: "default" as const,
	},
	finished: {
		label: "Game finished",
		icon: TrophyIcon,
		variant: "outline" as const,
	},
};

export function RoomStatus({ preloadedQuery, roomId }: RoomStatusProps) {
	const { data: session } = authClient.useSession();
	const room = usePreloadedQuery(preloadedQuery);
	const hasSpotifyLinked = useQuery(
		api.domains.spotify.queries.hasSpotifyAccount,
	);
	const startGame = useMutation(api.domains.rooms.mutations.start);
	const updateRoom = useMutation(api.domains.rooms.mutations.updateRoom);
	const [isStarting, setIsStarting] = useState(false);

	const handlePlaylistChange = async (
		playlistId: string,
		playlistName?: string,
		playlistImage?: string,
		playlistAuthor?: string | null,
	) => {
		await updateRoom({
			roomId,
			playlistId,
			playlistName,
			playlistImage,
			playlistAuthor: playlistAuthor ?? undefined,
		});
	};

	const isHost = session?.user?.id === room.hostId;
	const hasPlaylist = !!room.playlistId;
	const canStart = isHost && hasPlaylist && room.status === "waiting";

	const statusConfig = STATUS_CONFIG[room.status];
	const StatusIcon = statusConfig.icon;

	const handleStartGame = async () => {
		setIsStarting(true);
		try {
			await startGame({ roomId });
		} finally {
			setIsStarting(false);
		}
	};

	return (
		<div className="flex flex-col gap-4 rounded-xl border bg-card/50 p-4 backdrop-blur-sm">
			{/* Status Badge */}
			<div className="flex items-center justify-between">
				<Badge variant={statusConfig.variant} className="gap-1.5">
					<StatusIcon className="size-3" />
					{statusConfig.label}
				</Badge>
				<span className="text-muted-foreground text-xs">
					{room.playerCount} player{room.playerCount !== 1 ? "s" : ""}
				</span>
			</div>

			{/* Playlist Section */}
			{hasPlaylist ? (
				<div className="flex items-center gap-3">
					{room.playlistImage ? (
						<Image
							src={room.playlistImage}
							alt={room.playlistName ?? "Playlist"}
							width={48}
							height={48}
							className="rounded-md object-cover shadow-sm"
						/>
					) : (
						<div className="flex size-12 items-center justify-center rounded-md bg-primary/10">
							<DiscIcon className="size-5 text-primary" />
						</div>
					)}
					<div className="min-w-0 flex-1">
						<p className="truncate font-medium text-sm">
							{room.playlistName ?? "Unknown Playlist"}
						</p>
						<p className="truncate text-muted-foreground text-xs">
							{room.playlistAuthor ?? "Unknown Artist"}
						</p>
					</div>
				</div>
			) : (
				<div className="flex items-center gap-3 rounded-lg border border-dashed bg-muted/30 p-3">
					<div className="flex size-10 items-center justify-center rounded-md bg-muted">
						<DiscIcon className="size-5 text-muted-foreground" />
					</div>
					<p className="text-muted-foreground text-sm">
						{isHost
							? "Choose a playlist to start"
							: "Waiting for host to choose a playlist..."}
					</p>
				</div>
			)}

			{/* Host Actions */}
			{isHost && room.status === "waiting" && (
				<div className="flex flex-col gap-2">
					{!hasPlaylist && !hasSpotifyLinked && (
						<LinkSpotifyButton className="w-full" />
					)}
					{!hasPlaylist && hasSpotifyLinked && (
						<SpotifyPlaylistSelector onValueChange={handlePlaylistChange} />
					)}
					{hasPlaylist && (
						<Button
							onClick={handleStartGame}
							disabled={!canStart || isStarting}
							className="w-full"
						>
							<PlayIcon className="mr-2 size-4" />
							{isStarting ? "Starting..." : "Start Game"}
						</Button>
					)}
				</div>
			)}

			{/* Non-host waiting message */}
			{!isHost && room.status === "waiting" && hasPlaylist && (
				<p className="text-center text-muted-foreground text-sm">
					Waiting for host to start the game...
				</p>
			)}
		</div>
	);
}

"use client";

import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { Card, CardContent } from "@repo/ui/registry/new-york-v4/ui/card";
import { Skeleton } from "@repo/ui/registry/new-york-v4/ui/skeleton";
import { DiscIcon, PlayIcon } from "@repo/ui/registry/web/icons";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useState } from "react";
import { LinkSpotifyButton } from "@/features/spotify/components/link-spotify-button";
import { SpotifyPlaylistSelector } from "@/features/spotify/components/spotify-playlist-selector";
import { authClient } from "@/lib/auth-client";

interface RoomStatusProps {
	roomId: Id<"rooms">;
	room?: {
		_id: Id<"rooms">;
		name: string;
		isPrivate: boolean;
		status: "waiting" | "playing" | "finished";
		hostId: string;
		code?: string;
		playlistId?: string;
		playlistName?: string;
		playlistImage?: string;
		playlistAuthor?: string | null;
		playlistTotalTracks?: number;
		playerCount: number;
		isPlayer: boolean;
	};
	isLoading?: boolean;
}

const STATUS_LABELS = {
	waiting: "Waiting for the host",
	playing: "Game in progress",
	finished: "Game finished",
};

export function RoomStatus({ roomId, room, isLoading }: RoomStatusProps) {
	const { data: session } = authClient.useSession();
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
		playlistTotalTracks?: number,
	) => {
		await updateRoom({
			roomId,
			playlistId,
			playlistName,
			playlistImage,
			playlistAuthor: playlistAuthor ?? undefined,
			playlistTotalTracks,
		});
	};

	if (isLoading || !room) {
		return <RoomStatusSkeleton />;
	}

	const isHost = session?.user?.id === room.hostId;
	const hasPlaylist = !!room.playlistId;
	const canStart = isHost && hasPlaylist && room.status === "waiting";

	const statusLabel = STATUS_LABELS[room.status];

	const handleStartGame = async () => {
		setIsStarting(true);
		try {
			await startGame({ roomId });
		} finally {
			setIsStarting(false);
		}
	};

	return (
		<Card className="backdrop-blur-sm">
			<CardContent className="flex flex-col gap-4 pt-6">
				{/* Status Badge */}
				<p className="font-medium text-sm">{statusLabel}</p>

				{/* Playlist Section - Host can select, others just view */}
				{isHost && room.status === "waiting" ? (
					<div className="flex flex-col gap-2">
						{hasSpotifyLinked ? (
							<SpotifyPlaylistSelector
								onValueChange={handlePlaylistChange}
								initialPlaylist={
									hasPlaylist
										? {
												name: room.playlistName ?? "Unknown Playlist",
												image: room.playlistImage ?? undefined,
												author: room.playlistAuthor ?? undefined,
												totalTracks: room.playlistTotalTracks ?? undefined,
											}
										: undefined
								}
							/>
						) : (
							<LinkSpotifyButton className="w-full" />
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
				) : hasPlaylist ? (
					<div className="flex items-center gap-3 rounded-lg border border-dashed bg-muted/30 p-3">
						{room.playlistImage ? (
							<Image
								src={room.playlistImage}
								alt={room.playlistName ?? "Playlist"}
								width={40}
								height={40}
								className="rounded-md object-cover"
							/>
						) : (
							<div className="flex size-10 items-center justify-center rounded-md bg-muted">
								<DiscIcon className="size-5 text-muted-foreground" />
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
							Waiting for host to choose a playlist...
						</p>
					</div>
				)}

				{/* Non-host waiting message */}
				{!isHost && room.status === "waiting" && hasPlaylist && (
					<p className="text-center text-muted-foreground text-sm">
						Waiting for host to start the game...
					</p>
				)}
			</CardContent>
		</Card>
	);
}

export function RoomStatusSkeleton() {
	return (
		<Card className="backdrop-blur-sm">
			<CardContent className="flex flex-col gap-4 pt-6">
				<Skeleton className="h-5 w-32" />
				<div className="flex flex-col gap-2">
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
				</div>
			</CardContent>
		</Card>
	);
}

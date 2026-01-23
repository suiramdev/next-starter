"use client";

import type { Id } from "@repo/convex/_generated/dataModel";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { Skeleton } from "@repo/ui/registry/new-york-v4/ui/skeleton";
import { PlayIcon, SettingsIcon } from "@repo/ui/registry/web/icons";
import { authClient } from "@/lib/auth-client";
import { WaitingPlayersAvatars } from "./waiting-players-avatars";
import { RoomStatus } from "./room-status";
import { RoomSettingsButton } from "./room-settings-button";
import { SpotifyPlaylistSelector } from "@/features/spotify/components/spotify-playlist-selector";
import { LinkSpotifyButton } from "@/features/spotify/components/link-spotify-button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@repo/convex/_generated/api";
import { useState } from "react";

interface RoomViewProps {
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
	players?: Array<{
		id: Id<"players">;
		userId: string;
		isHost: boolean;
		score: number;
		user?: {
			id: string;
			name: string;
			image?: string;
		};
	}>;
	isLoading?: boolean;
}

export function RoomView({ room, players = [], isLoading }: RoomViewProps) {
	const { data: session } = authClient.useSession();
	const hasSpotifyLinked = useQuery(
		api.domains.spotify.queries.hasSpotifyAccount,
	);
	const startGame = useMutation(api.domains.rooms.mutations.start);
	const updateRoom = useMutation(api.domains.rooms.mutations.updateRoom);
	const [isStarting, setIsStarting] = useState(false);

	if (isLoading || !room) {
		return <RoomViewSkeleton />;
	}

	const isHost = session?.user?.id === room.hostId;
	const hasPlaylist = !!room.playlistId;
	const canStart = isHost && hasPlaylist && room.status === "waiting";

	const handlePlaylistChange = async (
		playlistId: string,
		playlistName?: string,
		playlistImage?: string,
		playlistAuthor?: string | null,
		playlistTotalTracks?: number,
	) => {
		await updateRoom({
			roomId: room._id,
			playlistId,
			playlistName,
			playlistImage,
			playlistAuthor: playlistAuthor ?? undefined,
			playlistTotalTracks,
		});
	};

	const handleStartGame = async () => {
		setIsStarting(true);
		try {
			await startGame({ roomId: room._id });
		} finally {
			setIsStarting(false);
		}
	};

	return (
		<div className="flex h-full flex-col">
			{/* Top Header */}
			<div className="flex shrink-0 items-center justify-center border-b px-4 py-4">
				<h1 className="font-semibold text-lg">Waiting for players...</h1>
			</div>

			{/* Center: Player Avatars */}
			<div className="flex flex-1 items-center justify-center overflow-auto px-4 py-4">
				<WaitingPlayersAvatars players={players} isLoading={isLoading} />
			</div>

			{/* Bottom: Host Controls */}
			{isHost && (
				<div className="shrink-0 border-t bg-background p-4 space-y-3">
					{/* Playlist Selection */}
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

					{/* Settings and Start Game Buttons */}
					<div className="flex gap-3">
						<RoomSettingsButton room={room} roomId={room._id} />
						{hasPlaylist && (
							<Button
								onClick={handleStartGame}
								disabled={!canStart || isStarting}
								className="flex-1"
							>
								<PlayIcon className="mr-2 size-4" />
								{isStarting ? "Starting..." : "Start Game"}
							</Button>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export function RoomViewSkeleton() {
	return (
		<div className="flex h-full flex-col">
			{/* Top Header Skeleton */}
			<div className="flex shrink-0 items-center justify-center border-b px-4 py-4">
				<Skeleton className="h-6 w-48" />
			</div>

			{/* Center: Player Avatars Skeleton */}
			<div className="flex flex-1 items-center justify-center overflow-auto px-4 py-4">
				<div className="flex flex-wrap items-center justify-center gap-4">
					{Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((key) => (
						<Skeleton key={key} className="size-16 rounded-full" />
					))}
				</div>
			</div>

			{/* Bottom: Controls Skeleton */}
			<div className="shrink-0 border-t bg-background p-4 space-y-3">
				<Skeleton className="h-10 w-full" />
				<div className="flex gap-3">
					<Skeleton className="h-10 w-10" />
					<Skeleton className="h-10 flex-1" />
				</div>
			</div>
		</div>
	);
}

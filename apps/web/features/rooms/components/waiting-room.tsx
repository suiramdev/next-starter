"use client";

import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";

import { Badge } from "@repo/ui/registry/new-york-v4/ui/badge";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/registry/new-york-v4/ui/card";
import { Separator } from "@repo/ui/registry/new-york-v4/ui/separator";
import {
	CopyIcon,
	DiscIcon,
	LockIcon,
	LogOutIcon,
	PlayIcon,
	UnlockIcon,
} from "@repo/ui/registry/web/icons";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SpotifyPlaylistSelector } from "@/components/spotify-playlist-selector";
import { PlayerList } from "./player-list";
import { RoomSettings } from "./room-settings";

interface WaitingRoomProps {
	roomId: Id<"rooms">;
}

export function WaitingRoom({ roomId }: WaitingRoomProps) {
	const room = useQuery(api.domains.rooms.queries.getRoom, { roomId });
	const startGame = useMutation(api.domains.rooms.mutations.start);
	const leaveRoom = useMutation(api.domains.rooms.mutations.leaveRoom);
	const updateRoom = useMutation(api.domains.rooms.mutations.updateRoom);
	const kickUser = useMutation(api.domains.rooms.mutations.kickUser);
	const { data: session } = authClient.useSession();
	const router = useRouter();

	const [isUpdatingPlaylist, setIsUpdatingPlaylist] = useState(false);

	useEffect(() => {
		const handleLeaveRoom = async () => {
			leaveRoom({ roomId });
		};

		window.onbeforeunload = handleLeaveRoom;
	}, [leaveRoom, roomId]);

	if (!room) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
			</div>
		);
	}

	const isHost = session?.user?.id === room.hostId;
	const currentUserId = session?.user?.id;

	const handleStartGame = async () => {
		try {
			await startGame({ roomId });
			toast.success("Game started!");
		} catch (error) {
			console.error(error);
			toast.error("Failed to start game");
		}
	};

	const handleLeave = async () => {
		try {
			await leaveRoom({ roomId });
			router.push("/");
			toast.success("Left room successfully");
		} catch (error) {
			toast.error("Failed to leave room");
		}
	};

	const handleCopyCode = () => {
		if (room.code) {
			navigator.clipboard.writeText(room.code);
			toast.success("Room code copied to clipboard");
		}
	};

	const handlePlaylistChange = async (
		id: string,
		name?: string,
		image?: string,
	) => {
		try {
			setIsUpdatingPlaylist(true);
			await updateRoom({
				roomId,
				playlistId: id,
				playlistName: name,
				playlistImage: image,
			});
			toast.success("Playlist updated");
		} catch (error) {
			toast.error("Failed to update playlist");
		} finally {
			setIsUpdatingPlaylist(false);
		}
	};

	const handleUpdateRoom = async (data: {
		name: string;
		isPrivate: boolean;
	}) => {
		try {
			await updateRoom({
				roomId,
				name: data.name,
				isPrivate: data.isPrivate,
			});
			toast.success("Room settings updated");
		} catch (error) {
			toast.error("Failed to update room settings");
		}
	};

	const handleKick = async (userId: string) => {
		try {
			await kickUser({ roomId, userId });
			toast.success("Player kicked");
		} catch (error) {
			toast.error("Failed to kick player");
		}
	};

	return (
		<div className="mx-auto max-w-5xl space-y-8 p-4">
			{/* Header */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="space-y-1">
					<div className="flex items-center gap-3">
						<h1 className="font-bold text-3xl tracking-tight">{room.name}</h1>
						{isHost && (
							<RoomSettings
								name={room.name}
								isPrivate={room.isPrivate}
								onUpdate={handleUpdateRoom}
							/>
						)}
					</div>
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						{room.isPrivate ? (
							<Badge variant="secondary" className="gap-1">
								<LockIcon className="size-3" /> Private
							</Badge>
						) : (
							<Badge variant="outline" className="gap-1">
								<UnlockIcon className="size-3" /> Public
							</Badge>
						)}
						{room.code && (
							<Badge
								variant="outline"
								className="cursor-pointer gap-1 hover:bg-muted"
								onClick={handleCopyCode}
							>
								Code: <span className="font-mono">{room.code}</span>
								<CopyIcon className="size-3" />
							</Badge>
						)}
					</div>
				</div>
				<Button variant="destructive" size="sm" onClick={handleLeave}>
					<LogOutIcon className="mr-2 size-4" />
					Leave Room
				</Button>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{/* Playlist Section */}
				<Card className="border-primary/20 bg-background/50 backdrop-blur-sm md:col-span-1 lg:col-span-1">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<DiscIcon className="size-5 text-primary" />
							Current Playlist
						</CardTitle>
						<CardDescription>
							The music that will play during the game
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="relative aspect-square w-full overflow-hidden rounded-md border bg-muted shadow-sm">
							{room.playlistImage ? (
								<Image
									src={room.playlistImage}
									alt="Playlist Cover"
									fill
									className="object-cover transition-transform hover:scale-105"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center bg-secondary/50">
									<DiscIcon className="size-16 text-muted-foreground/50" />
								</div>
							)}
						</div>

						<div className="space-y-2">
							<h3 className="truncate font-semibold text-lg">
								{room.playlistName || "No playlist selected"}
							</h3>
							{isHost ? (
								<SpotifyPlaylistSelector onValueChange={handlePlaylistChange} />
							) : (
								<p className="text-muted-foreground text-sm">
									Waiting for host to select a playlist...
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Players Section */}
				<Card className="border-border/50 bg-background/50 backdrop-blur-sm md:col-span-1 lg:col-span-2">
					<CardHeader>
						<CardTitle>Lobby</CardTitle>
						<CardDescription>Manage players and start the game</CardDescription>
					</CardHeader>
					<CardContent>
						<PlayerList
							players={room.players}
							currentUserId={currentUserId}
							hostId={room.hostId}
							onKick={handleKick}
							onBan={handleBan}
						/>

						<Separator className="my-6" />

						<div className="flex justify-end">
							{isHost ? (
								<Button
									size="lg"
									className="w-full bg-[#1DB954] font-bold text-white hover:bg-[#1ed760] sm:w-auto"
									onClick={handleStartGame}
									disabled={!room.playlistId}
								>
									<PlayIcon className="mr-2 size-5" />
									Start Game
								</Button>
							) : (
								<div className="flex w-full items-center justify-center rounded-md bg-secondary/50 p-4 text-muted-foreground">
									Waiting for host to start...
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

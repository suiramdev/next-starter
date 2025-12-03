"use client";

import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import {
	Avatar,
	AvatarFallback,
} from "@repo/ui/registry/new-york-v4/ui/avatar";
import { Badge } from "@repo/ui/registry/new-york-v4/ui/badge";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { CrownIcon, DiscIcon, LogInIcon } from "@repo/ui/registry/web/icons";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RoomPreviewProps {
	roomId: Id<"rooms">;
}

export function RoomPreview({ roomId }: RoomPreviewProps) {
	const room = useQuery(api.domains.rooms.queries.getRoom, { roomId });
	const joinRoom = useMutation(api.domains.rooms.mutations.joinRoom);
	const router = useRouter();

	const handleJoin = async () => {
		if (!room?.code) return;
		try {
			const roomId = await joinRoom({ code: room.code });
			router.push(`/rooms/${roomId}`);
		} catch (error) {
			toast.error("Failed to join room");
			console.error(error);
		}
	};

	if (!room) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="size-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
			</div>
		);
	}

	const statusLabel =
		room.status === "waiting"
			? "Waiting for players"
			: room.status === "playing"
				? "Game in progress"
				: "Game finished";

	const statusColor =
		room.status === "waiting"
			? "text-amber-500"
			: room.status === "playing"
				? "text-emerald-500"
				: "text-muted-foreground";

	return (
		<div className="flex h-full flex-col">
			<div className="flex-1 space-y-6 overflow-y-auto">
				<h2 className="font-bold text-lg">{room.name}</h2>
				<div>
					{room.playlistName ? (
						<div className="flex items-center gap-3 rounded-lg border bg-card/50 p-3">
							{room.playlistImage ? (
								<Image
									src={room.playlistImage}
									alt={room.playlistName}
									className="rounded-md object-cover shadow-md"
									width={56}
									height={56}
								/>
							) : (
								<div className="relative flex size-14 items-center justify-center rounded-md bg-primary/10">
									<DiscIcon className="size-6 text-muted-foreground" />
								</div>
							)}
							<div className="flex-1 overflow-hidden">
								<p className="truncate font-medium">{room.playlistName}</p>
								<p className="text-muted-foreground text-sm">
									Spotify Playlist
								</p>
							</div>
						</div>
					) : (
						<div className="flex items-center gap-3 rounded-lg border border-dashed bg-muted/30 p-3">
							<div className="relative flex size-14 items-center justify-center rounded-md bg-muted">
								<DiscIcon className="size-6 text-muted-foreground" />
							</div>
							<p className="text-muted-foreground text-sm italic">
								Host is choosing a playlist...
							</p>
						</div>
					)}
				</div>
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<h4 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
							Players
						</h4>
						<Badge
							variant="secondary"
							className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
						>
							{room.players.length}
						</Badge>
					</div>
					<div className="space-y-2">
						{room.players.map((player, index) => (
							<div
								key={player._id}
								className="flex items-center gap-3 rounded-lg border bg-card/50 p-2.5"
							>
								<Avatar className="size-9">
									<AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-xs">
										{player.userId.slice(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 overflow-hidden">
									<p className="flex items-center gap-2 truncate font-medium text-sm">
										Player {player.userId.slice(0, 8)}
										{index === 0 && (
											<CrownIcon className="size-3.5 text-amber-500" />
										)}
									</p>
									<p className="text-muted-foreground text-xs">
										Score: {player.score}
									</p>
								</div>
							</div>
						))}
						{room.players.length === 0 && (
							<p className="py-4 text-center text-muted-foreground text-sm italic">
								No players yet
							</p>
						)}
					</div>
				</div>
			</div>
			<div>
				<Button
					onClick={handleJoin}
					className="w-full gap-2"
					size="lg"
					disabled={room.status !== "waiting" || !room.code}
				>
					<LogInIcon className="size-4" />
					{room.status === "waiting" ? "Join Room" : "Game in Progress"}
				</Button>
			</div>
		</div>
	);
}

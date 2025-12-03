"use client";

import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/registry/new-york-v4/ui/table";
import { DiscIcon, LogInIcon, Users } from "@repo/ui/registry/web/icons";
import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { RoomPreview } from "./room-preview";

type RoomsListProps = {
	preloadedQuery: Preloaded<typeof api.domains.rooms.queries.listRooms>;
};

export function RoomsList({ preloadedQuery }: RoomsListProps) {
	const [selectedRoomId, setSelectedRoomId] = useState<Id<"rooms"> | undefined>(
		undefined,
	);
	const rooms = usePreloadedQuery(preloadedQuery);
	const joinRoom = useMutation(api.domains.rooms.mutations.joinRoom);
	const router = useRouter();

	const handleJoin = async (e: React.MouseEvent, code: string | undefined) => {
		e.stopPropagation();
		if (!code) return;
		try {
			const roomId = await joinRoom({ code });
			router.push(`/rooms/${roomId}`);
		} catch (error) {
			toast.error("Failed to join room");
			console.error(error);
		}
	};

	return (
		<div className="flex h-full w-full">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Room</TableHead>
						<TableHead>Playlist</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Players</TableHead>
						<TableHead />
					</TableRow>
				</TableHeader>
				<TableBody>
					{rooms?.map((room) => {
						const isSelected = selectedRoomId === room._id;

						return (
							<TableRow
								key={room._id}
								className={cn(
									"group cursor-pointer transition-colors",
									isSelected && "bg-accent",
								)}
								onClick={() => setSelectedRoomId(room._id)}
							>
								<TableCell>
									<span className="font-medium">{room.name}</span>
								</TableCell>
								<TableCell>
									{room.playlistName ? (
										<div className="flex items-center gap-2">
											{room.playlistImage ? (
												<Image
													src={room.playlistImage}
													alt={room.playlistName}
													className="rounded object-cover"
													width={24}
													height={24}
												/>
											) : (
												<div className="relative aspect-square size-6 rounded-xs bg-primary/20">
													<DiscIcon className="absolute inset-0 m-auto size-3 text-muted-foreground" />
												</div>
											)}
											<span className="text-muted-foreground">
												{room.playlistName}
											</span>
										</div>
									) : (
										<span className="text-muted-foreground">
											Choosing a playlist...
										</span>
									)}
								</TableCell>
								<TableCell>
									<span className="text-muted-foreground">
										{room.status === "waiting"
											? "Waiting for players"
											: room.status === "playing"
												? "Playing"
												: "Finished"}
									</span>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2 text-muted-foreground">
										<Users className="h-4 w-4" />
										<span>
											{room.players.length} player
											{room.players.length !== 1 ? "s" : ""}
										</span>
									</div>
								</TableCell>
								<TableCell className="text-right">
									<Button onClick={(e) => handleJoin(e, room.code)}>
										Join
									</Button>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
			{selectedRoomId && (
				<div className="ml-8 hidden w-1/3 md:block">
					<RoomPreview roomId={selectedRoomId} />
				</div>
			)}
		</div>
	);
}

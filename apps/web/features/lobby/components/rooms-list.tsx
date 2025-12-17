"use client";

import { api } from "@repo/convex/_generated/api";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { RoomCard } from "@repo/ui/registry/web/room-card";
import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { JoinRoomDialog, JoinRoomDialogTrigger } from "./join-room-dialog";

type RoomsListProps = {
	preloadedQuery: Preloaded<typeof api.domains.rooms.queries.listRooms>;
};

export function RoomsList({ preloadedQuery }: RoomsListProps) {
	const rooms = usePreloadedQuery(preloadedQuery);
	const joinRoom = useMutation(api.domains.rooms.mutations.joinRoom);
	const router = useRouter();

	// Filter for public rooms only and sort by status (available games first)
	const publicRooms =
		rooms
			?.filter((room) => !room.isPrivate)
			.sort((a, b) => {
				// Priority: waiting (0) > playing (1) > finished (2)
				const statusPriority = {
					waiting: 0,
					playing: 1,
					finished: 2,
				};
				return statusPriority[a.status] - statusPriority[b.status];
			}) ?? [];

	const handleJoin = async (code: string | undefined) => {
		if (!code) return;
		try {
			const roomId = await joinRoom({ code });
			router.push(`/rooms/${roomId}`);
		} catch (error) {
			toast.error("Failed to join room");
			console.error(error);
		}
	};

	const header = (
		<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
			<h2 className="font-semibold text-xl">Play with others</h2>
			<div className="flex items-center gap-2">
				<JoinRoomDialog>
					<JoinRoomDialogTrigger asChild>
						<Button variant="secondary">Join with Code</Button>
					</JoinRoomDialogTrigger>
				</JoinRoomDialog>
				<Button asChild>
					<Link href="/rooms/new">Create Room</Link>
				</Button>
			</div>
		</div>
	);

	if (publicRooms.length === 0) {
		return (
			<div className="flex flex-col gap-4">
				{header}
				<p className="text-muted-foreground">
					No public rooms available at the moment. Create your own room to get
					started!
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{header}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{publicRooms.map((room) => (
					<RoomCard
						key={room._id}
						name={room.name}
						playlistName={room.playlistName}
						playlistImage={room.playlistImage}
						playerCount={room.playerCount}
						players={room.players}
						disabled={room.status === "finished"}
						onClick={() => {
							if (room.status !== "finished") {
								handleJoin(room.code);
							}
						}}
					/>
				))}
			</div>
		</div>
	);
}

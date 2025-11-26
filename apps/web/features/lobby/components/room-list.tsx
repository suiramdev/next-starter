"use client";

import { api } from "@repo/convex/_generated/api";
import { UsersIcon } from "@repo/ui/registry/admin/icons";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@repo/ui/registry/new-york-v4/ui/card";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function RoomList() {
	const rooms = useQuery(api.queries.rooms.getWaitingRooms);
	const joinRoom = useMutation(api.mutations.rooms.joinRoom);
	const router = useRouter();

	const handleJoin = async (code: string) => {
		try {
			const roomId = await joinRoom({ code });
			router.push(`/rooms/${roomId}`);
		} catch (error) {
			toast.error("Failed to join room");
			console.error(error);
		}
	};

	if (!rooms) {
		return <div>Loading rooms...</div>;
	}

	if (rooms.length === 0) {
		return (
			<div className="text-center text-muted-foreground">
				No waiting rooms available. Create one to get started!
			</div>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{rooms.map((room) => (
				<Card key={room._id}>
					<CardHeader>
						<CardTitle>{room.name}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-2 text-muted-foreground text-sm">
							<UsersIcon className="h-4 w-4" />
							<span>Waiting for players</span>
						</div>
					</CardContent>
					<CardFooter>
						<Button className="w-full" onClick={() => handleJoin(room._id)}>
							Join Room
						</Button>
					</CardFooter>
				</Card>
			))}
		</div>
	);
}

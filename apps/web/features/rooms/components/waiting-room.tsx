"use client";

import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/registry/new-york-v4/ui/card";
import { useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface WaitingRoomProps {
	roomId: Id<"rooms">;
}

export function WaitingRoom({ roomId }: WaitingRoomProps) {
	const room = useQuery(api.queries.rooms.getRoom, { roomId });
	const startGame = useMutation(api.mutations.rooms.start);
	const leaveRoom = useMutation(api.mutations.rooms.leaveRoom);
	const { data: session } = authClient.useSession();

	useEffect(() => {
		const handleLeaveRoom = async () => {
			leaveRoom({ roomId });
		};

		window.onbeforeunload = handleLeaveRoom;
	}, [leaveRoom, roomId]);

	if (!room) {
		return <div>Loading room...</div>;
	}

	const isHost = session?.user?.id === room.hostId;

	const handleStartGame = async () => {
		try {
			await startGame({ roomId });
			toast.success("Game started!");
		} catch (error) {
			console.error(error);
			toast.error("Failed to start game");
		}
	};

	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-center text-2xl">{room.name}</CardTitle>
					<div className="text-center text-muted-foreground text-sm">
						Code: <span className="font-bold font-mono">{room.code}</span>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					<div>
						<h3 className="mb-4 font-semibold text-lg">
							Players ({room.players.length})
						</h3>
						<div className="grid grid-cols-2 gap-4">
							{room.players.map((player) => (
								<div
									key={player._id}
									className="flex items-center gap-2 rounded-lg border p-3"
								>
									<div className="h-8 w-8 rounded-full bg-primary/20" />
									<div className="flex flex-col">
										<span className="font-medium">
											{player.userId === session?.user?.id
												? "You"
												: `Player ${player.userId.slice(0, 4)}`}
										</span>
										{player.userId === room.hostId && (
											<span className="text-primary text-xs">Host</span>
										)}
									</div>
								</div>
							))}
						</div>
					</div>

					{isHost ? (
						<Button className="w-full" size="lg" onClick={handleStartGame}>
							Start Game
						</Button>
					) : (
						<div className="text-center text-muted-foreground">
							Waiting for host to start the game...
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

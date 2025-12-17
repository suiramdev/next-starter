"use client";

import type { api } from "@repo/convex/_generated/api";
import type { Preloaded } from "convex/react";
import { usePreloadedQuery } from "convex/react";
import { ChatBox } from "./chat-box";
import { PlayersList } from "./players-list";
import { RoomStatus } from "./room-status";

interface RoomLobbyViewProps {
	preloadedRoom: Preloaded<typeof api.domains.rooms.queries.getRoom>;
	preloadedPlayers: Preloaded<typeof api.domains.players.queries.listPlayers>;
	preloadedMessages: Preloaded<
		typeof api.domains.messages.queries.listMessages
	>;
}

export function RoomLobbyView({
	preloadedRoom,
	preloadedPlayers,
	preloadedMessages,
}: RoomLobbyViewProps) {
	const room = usePreloadedQuery(preloadedRoom);
	const players = usePreloadedQuery(preloadedPlayers);
	const messages = usePreloadedQuery(preloadedMessages);

	return (
		<div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-3">
			{/* Main Content - Left Side */}
			<div className="flex flex-col gap-6 lg:col-span-2">
				{/* Room Header */}
				<div className="flex flex-col gap-2">
					<h1 className="font-bold text-3xl tracking-tight">{room.name}</h1>
					<p className="text-muted-foreground">
						Waiting for players to join and the host to start the game
					</p>
				</div>

				{/* Room Status & Controls */}
				<RoomStatus roomId={room._id} room={room} />

				{/* Players List */}
				<div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
					<h2 className="font-semibold text-lg">Players</h2>
					<PlayersList roomId={room._id} players={players} />
				</div>
			</div>

			{/* Sidebar - Right Side */}
			<div className="flex flex-col">
				<ChatBox roomId={room._id} messages={messages} />
			</div>
		</div>
	);
}

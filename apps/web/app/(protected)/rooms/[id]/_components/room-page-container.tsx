"use client";

import type { api } from "@repo/convex/_generated/api";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { Game } from "@/features/game/components/game";
import { Room } from "@/features/rooms/components/room";

interface RoomPageContainerProps {
	preloadedRoom: Preloaded<typeof api.domains.rooms.queries.getRoom>;
	preloadedPlayers: Preloaded<typeof api.domains.players.queries.listPlayers>;
	preloadedGame: Preloaded<typeof api.domains.game.queries.getCurrentGame>;
}

export function RoomPageContainer({
	preloadedRoom,
	preloadedPlayers,
	preloadedGame,
}: RoomPageContainerProps) {
	const room = usePreloadedQuery(preloadedRoom);
	const game = usePreloadedQuery(preloadedGame);

	if (room.status === "playing" || room.status === "finished") {
		return (
			<Game
				preloadedRoom={preloadedRoom}
				preloadedPlayers={preloadedPlayers}
				preloadedGame={preloadedGame}
			/>
		);
	}

	return (
		<Room
			preloadedRoom={preloadedRoom}
			preloadedPlayers={preloadedPlayers}
		/>
	);
}

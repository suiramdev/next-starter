"use client";

import type { api } from "@repo/convex/_generated/api";
import type { Preloaded } from "convex/react";
import { usePreloadedQuery } from "convex/react";
import { RoomView } from "./room-view";

interface RoomProps {
	preloadedRoom: Preloaded<typeof api.domains.rooms.queries.getRoom>;
	preloadedPlayers: Preloaded<typeof api.domains.players.queries.listPlayers>;
}

export function Room({ preloadedRoom, preloadedPlayers }: RoomProps) {
	const room = usePreloadedQuery(preloadedRoom);
	const players = usePreloadedQuery(preloadedPlayers);

	const isLoading = !room || !players;

	return <RoomView room={room} players={players} isLoading={isLoading} />;
}

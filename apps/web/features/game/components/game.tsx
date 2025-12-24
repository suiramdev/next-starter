"use client";

import { convexQuery } from "@convex-dev/react-query";
import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import { useQuery } from "@tanstack/react-query";
import type { Preloaded } from "convex/react";
import { usePreloadedQuery } from "convex/react";
import { GameView } from "./game-view";

interface GameProps {
	preloadedRoom: Preloaded<typeof api.domains.rooms.queries.getRoom>;
	preloadedPlayers: Preloaded<typeof api.domains.players.queries.listPlayers>;
	preloadedGame: Preloaded<typeof api.domains.game.queries.getCurrentGame>;
}

export function Game({
	preloadedRoom,
	preloadedPlayers: _preloadedPlayers,
	preloadedGame,
}: GameProps) {
	const room = usePreloadedQuery(preloadedRoom);
	const game = usePreloadedQuery(preloadedGame);

	const { data: round, isLoading: isLoadingRound } = useQuery({
		...convexQuery(api.domains.game.queries.getCurrentRound, {
			gameId: game?._id ?? ("skip" as Id<"games">),
		}),
		enabled: !!game?._id,
	});

	const isLoading = !game || isLoadingRound || !round;

	return (
		<GameView
			gameId={game?._id ?? ("skip" as Id<"games">)}
			roomId={room._id}
			round={round ?? undefined}
			isLoading={isLoading}
		/>
	);
}

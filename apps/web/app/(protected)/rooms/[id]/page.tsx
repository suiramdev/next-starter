import { getToken } from "@convex-dev/better-auth/nextjs";
import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import { createAuth } from "@repo/convex/domains/auth/setup";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import { RoomGameView } from "@/features/rooms/components/room-game-view";
import { RoomLobbyView } from "@/features/rooms/components/room-lobby-view";

interface RoomPageProps {
	params: Promise<{ id: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
	const { id } = await params;
	const token = await getToken(createAuth);

	if (!token) {
		notFound();
	}

	// Fetch room data to check access
	const room = await fetchQuery(
		api.domains.rooms.queries.getRoom,
		{ roomId: id as Id<"rooms"> },
		{ token },
	);

	if (!room || !room.isPlayer) {
		notFound();
	}

	// Preload queries for client components
	const roomQuery = await preloadQuery(
		api.domains.rooms.queries.getRoom,
		{ roomId: id as Id<"rooms"> },
		{ token },
	);

	const playersQuery = await preloadQuery(
		api.domains.players.queries.listPlayers,
		{ roomId: id as Id<"rooms"> },
		{ token },
	);

	const messagesQuery = await preloadQuery(
		api.domains.messages.queries.listMessages,
		{ roomId: id as Id<"rooms"> },
		{ token },
	);

	// Preload game data if room is playing or finished
	let gameQuery = null;
	let currentRoundQuery = null;

	if (room.status === "playing" || room.status === "finished") {
		const game = await fetchQuery(
			api.domains.game.queries.getCurrentGame,
			{ roomId: id as Id<"rooms"> },
			{ token },
		).catch(() => null);

		if (game?._id) {
			gameQuery = await preloadQuery(
				api.domains.game.queries.getCurrentGame,
				{ roomId: id as Id<"rooms"> },
				{ token },
			).catch(() => null);

			if (gameQuery) {
				currentRoundQuery = await preloadQuery(
					api.domains.game.queries.getCurrentRound,
					{ gameId: game._id },
					{ token },
				).catch(() => null);
			}
		}
	}

	// Render appropriate view based on room status
	if (room.status === "waiting") {
		return (
			<RoomLobbyView
				preloadedRoom={roomQuery}
				preloadedPlayers={playersQuery}
				preloadedMessages={messagesQuery}
			/>
		);
	}

	return (
		<RoomGameView
			preloadedRoom={roomQuery}
			preloadedPlayers={playersQuery}
			preloadedMessages={messagesQuery}
			preloadedGame={gameQuery}
			preloadedCurrentRound={currentRoundQuery}
		/>
	);
}

import { getToken } from "@convex-dev/better-auth/nextjs";
import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import { createAuth } from "@repo/convex/domains/auth/setup";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import { RoomPageContainer } from "./_components/room-page-container";

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

	// If room is not found, redirect to 404
	if (!room) {
		notFound();
	}

	// If user is not a player in the room, redirect to 404
	if (!room.isPlayer) {
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

	const gameQuery = await preloadQuery(
		api.domains.game.queries.getCurrentGame,
		{ roomId: id as Id<"rooms"> },
		{ token },
	);

	return (
		<RoomPageContainer
			preloadedRoom={roomQuery}
			preloadedPlayers={playersQuery}
			preloadedGame={gameQuery}
		/>
	);
}

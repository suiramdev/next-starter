"use client";

import type { api } from "@repo/convex/_generated/api";
import type { Preloaded } from "convex/react";
import { usePreloadedQuery } from "convex/react";
import { GamePlayingView } from "@/features/game/components/game-playing-view";
import { GameResults } from "@/features/game/components/game-results";
import { GameRevealView } from "@/features/game/components/game-reveal-view";
import { RoundLeaderboard } from "@/features/game/components/round-leaderboard";
import { ChatBox } from "./chat-box";
import { PlayersList } from "./players-list";

interface RoomGameViewProps {
	preloadedRoom: Preloaded<typeof api.domains.rooms.queries.getRoom>;
	preloadedPlayers: Preloaded<typeof api.domains.players.queries.listPlayers>;
	preloadedMessages: Preloaded<
		typeof api.domains.messages.queries.listMessages
	>;
	preloadedGame: Preloaded<
		typeof api.domains.game.queries.getCurrentGame
	> | null;
	preloadedCurrentRound: Preloaded<
		typeof api.domains.game.queries.getCurrentRound
	> | null;
}

export function RoomGameView({
	preloadedRoom,
	preloadedPlayers,
	preloadedMessages,
	preloadedGame,
	preloadedCurrentRound,
}: RoomGameViewProps) {
	const room = usePreloadedQuery(preloadedRoom);
	const players = usePreloadedQuery(preloadedPlayers);
	const messages = usePreloadedQuery(preloadedMessages);
	const game = preloadedGame ? usePreloadedQuery(preloadedGame) : null;
	const round = preloadedCurrentRound
		? usePreloadedQuery(preloadedCurrentRound)
		: null;

	// Determine which game view to show based on round status
	const renderGameContent = () => {
		if (!game || !round) {
			return (
				<div className="flex h-full items-center justify-center">
					<p className="text-muted-foreground">Loading game...</p>
				</div>
			);
		}

		// Show results if game is finished
		if (game.status === "finished") {
			return <GameResults gameId={game._id} />;
		}

		// Show reveal view if round is revealing or finished
		if (
			round.status === "revealing" ||
			round.status === "finished" ||
			round.status === "countdown"
		) {
			return <GameRevealView gameId={game._id} roundId={round._id} />;
		}

		// Show playing view
		return <GamePlayingView gameId={game._id} roundId={round._id} />;
	};

	return (
		<div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-3">
			{/* Main Game Area - Left Side */}
			<div className="flex flex-col gap-6 lg:col-span-2">
				{/* Room Header */}
				<div className="flex flex-col gap-2">
					<h1 className="font-bold text-3xl tracking-tight">{room.name}</h1>
					{game && (
						<p className="text-muted-foreground">
							Round {game.completedRounds + 1} of {game.totalRounds}
						</p>
					)}
				</div>

				{/* Game Content */}
				<div className="flex flex-1 flex-col">{renderGameContent()}</div>

				{/* Round Leaderboard */}
				{game && round && (
					<RoundLeaderboard
						roomId={room._id}
						gameId={game._id}
						roundId={round._id}
					/>
				)}
			</div>

			{/* Sidebar - Right Side */}
			<div className="flex flex-col gap-6">
				{/* Players List */}
				<div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
					<h2 className="font-semibold text-lg">Leaderboard</h2>
					<PlayersList roomId={room._id} players={players} />
				</div>

				{/* Chat */}
				<ChatBox roomId={room._id} messages={messages} />
			</div>
		</div>
	);
}

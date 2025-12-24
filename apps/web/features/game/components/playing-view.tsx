"use client";

import type { Id } from "@repo/convex/_generated/dataModel";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@repo/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { TrackPlayer } from "@repo/ui/registry/web/track-player";
import { GuessInput } from "./guess-input";
import { PlayersWithPoints } from "./players-with-points";

interface PlayingViewProps {
	gameId: Id<"games">;
	roundId: Id<"rounds">;
	previewUrl: string;
	roomId: Id<"rooms">;
}

export function PlayingView({
	gameId,
	roundId,
	previewUrl,
	roomId,
}: PlayingViewProps) {
	const { data: players, isLoading: isLoadingPlayers } = useQuery(
		convexQuery(api.domains.players.queries.listPlayers, { roomId }),
	);

	const { data: gameScores, isLoading: isLoadingScores } = useQuery(
		convexQuery(api.domains.game.queries.getGameScores, { gameId }),
	);

	const isLoading = isLoadingPlayers || isLoadingScores;

	// Combine players with their total points
	const playersWithPoints =
		players && gameScores
			? players.map((player) => {
					const score = gameScores.find((s) => s.userId === player.userId);
					return {
						userId: player.userId,
						user: player.user,
						totalPoints: score?.totalPoints ?? 0,
					};
				})
			: [];

	return (
		<div className="flex h-full flex-col">
			{/* Top: Player Avatars with Points */}
			<div className="flex shrink-0 items-center justify-center border-b px-4 py-3">
				<PlayersWithPoints players={playersWithPoints} isLoading={isLoading} />
			</div>

			{/* Center: Track Player with Timer */}
			<div className="flex flex-1 items-center justify-center overflow-auto px-4">
				<TrackPlayer previewUrl={previewUrl} isPlaying />
			</div>

			{/* Bottom: Guess Input */}
			<div className="shrink-0 border-t bg-background p-4">
				<GuessInput gameId={gameId} roundId={roundId} />
			</div>
		</div>
	);
}


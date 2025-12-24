"use client";

import { convexQuery } from "@convex-dev/react-query";
import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import { useQuery } from "@tanstack/react-query";
import { RoundLeaderboardView } from "./round-leaderboard-view";

interface RoundLeaderboardProps {
	roundId: Id<"rounds">;
	roomId: Id<"rooms">;
}

export function RoundLeaderboard({ roundId, roomId }: RoundLeaderboardProps) {
	const { data: players, isLoading: isLoadingPlayers } = useQuery(
		convexQuery(api.domains.players.queries.listPlayers, { roomId }),
	);

	const { data: roundScores, isLoading: isLoadingScores } = useQuery(
		convexQuery(api.domains.game.queries.getRoundScores, { roundId }),
	);

	const isLoading = isLoadingPlayers || isLoadingScores;

	if (isLoading || !players) {
		return <RoundLeaderboardView players={[]} isLoading />;
	}

	// Create a map of round scores by userId
	const scoreMap = new Map(
		(roundScores ?? []).map((score) => [score.userId, score.points]),
	);

	// Combine players with their round scores (default to 0 if no score)
	const playersWithScores = players.map((player) => ({
		...player,
		roundPoints: scoreMap.get(player.userId) ?? 0,
	}));

	// Sort by round points descending
	const sortedPlayers = [...playersWithScores].sort(
		(a, b) => b.roundPoints - a.roundPoints,
	);

	return <RoundLeaderboardView players={sortedPlayers} />;
}

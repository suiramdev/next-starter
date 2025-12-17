"use client";

import { convexQuery } from "@convex-dev/react-query";
import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import { useQuery } from "@tanstack/react-query";
import { TrackReveal } from "./track-reveal";

interface GameRevealViewProps {
	roundId: Id<"rounds">;
	gameId: Id<"games">;
}

export function GameRevealView({ roundId: _roundId, gameId }: GameRevealViewProps) {
	const { data: round } = useQuery(
		convexQuery(api.domains.game.queries.getCurrentRound, { gameId }),
	);

	const { data: gameScores } = useQuery(
		convexQuery(api.domains.game.queries.getGameScores, { gameId }),
	);

	if (!round || !gameScores) {
		return null;
	}

	return (
		<TrackReveal
			trackTitle={round.trackTitle}
			trackArtist={round.trackArtist}
			trackImage={round.trackImage}
			artistGuessedBy={round.artistGuessedBy}
			titleGuessedBy={round.titleGuessedBy}
			gameScores={gameScores}
		/>
	);
}

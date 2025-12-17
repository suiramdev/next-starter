"use client";

import { convexQuery } from "@convex-dev/react-query";
import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import { useQuery } from "@tanstack/react-query";
import { GuessInput } from "./guess-input";
import { TrackPlayer } from "./track-player";

interface GamePlayingViewProps {
	gameId: Id<"games">;
	roundId?: Id<"rounds">;
}

export function GamePlayingView({ gameId }: GamePlayingViewProps) {
	const { data: round } = useQuery(
		convexQuery(api.domains.game.queries.getCurrentRound, { gameId }),
	);

	if (!round) {
		return null;
	}

	return (
		<>
			<TrackPlayer
				previewUrl={round.trackPreviewUrl}
				isPlaying={round.status === "playing"}
				userGuessedArtist={round.userGuessedArtist}
				userGuessedTitle={round.userGuessedTitle}
				revealedArtist={round.trackArtist}
				revealedTitle={round.trackTitle}
			/>
			<GuessInput
				gameId={gameId}
				roundId={round._id}
				disabled={round.status !== "playing"}
				userGuessedArtist={round.userGuessedArtist}
				userGuessedTitle={round.userGuessedTitle}
			/>
		</>
	);
}

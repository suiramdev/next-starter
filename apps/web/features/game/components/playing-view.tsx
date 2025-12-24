import type { Id } from "@repo/convex/_generated/dataModel";
import { TrackPlayer } from "@repo/ui/registry/web/track-player";
import { GuessInput } from "./guess-input";

interface PlayingViewProps {
	gameId: Id<"games">;
	roundId: Id<"rounds">;
	previewUrl: string;
}

export function PlayingView({ gameId, roundId, previewUrl }: PlayingViewProps) {
	return (
		<>
			<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
				<h2 className="mb-8 text-center font-bold text-2xl tracking-tight">
					Guess the track!
				</h2>
				<TrackPlayer previewUrl={previewUrl} isPlaying />
			</div>

			<div className="w-full">
				<GuessInput gameId={gameId} roundId={roundId} />
			</div>
		</>
	);
}


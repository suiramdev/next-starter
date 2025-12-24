import type { Id } from "@repo/convex/_generated/dataModel";
import { Skeleton } from "@repo/ui/registry/new-york-v4/ui/skeleton";
import { CountdownView } from "./countdown-view";
import { PlayingView } from "./playing-view";
import { RevealingView } from "./revealing-view";
import { RoundLeaderboard } from "./round-leaderboard";

interface GameViewProps {
	gameId: Id<"games">;
	roomId: Id<"rooms">;
	round?: {
		_id: Id<"rounds">;
		roundNumber: number;
		status: "countdown" | "playing" | "revealing" | "finished";
		trackPreviewUrl: string;
		trackTitle?: string;
		trackArtist?: string;
		trackImage?: string;
		userGuessedArtist: boolean;
		userGuessedTitle: boolean;
		artistGuessedBy?: string;
		titleGuessedBy?: string;
		startedAt?: number;
		endsAt?: number;
	};
	isLoading?: boolean;
}

export function GameView({ gameId, roomId, round, isLoading }: GameViewProps) {
	if (isLoading || !round) {
		return <GameViewSkeleton />;
	}
	const renderRoundView = () => {
		switch (round.status) {
			case "countdown":
				return <CountdownView />;
			case "playing":
				return (
					<PlayingView
						gameId={gameId}
						roundId={round._id}
						previewUrl={round.trackPreviewUrl}
					/>
				);
			case "revealing":
			case "finished":
				return (
					<RevealingView
						trackTitle={round.trackTitle}
						trackArtist={round.trackArtist}
						trackImage={round.trackImage}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-between gap-8">
			<RoundLeaderboard roundId={round._id} roomId={roomId} />
			{renderRoundView()}
		</div>
	);
}

export function GameViewSkeleton() {
	return (
		<div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-between gap-8">
			{/* Round Leaderboard Skeleton */}
			<div className="flex justify-center gap-4">
				{Array.from({ length: 3 }, (_, i) => `skeleton-avatar-${i}`).map(
					(key) => (
						<Skeleton key={key} className="size-16 rounded-full" />
					),
				)}
			</div>

			{/* Game View Skeleton */}
			<div className="flex w-full flex-col items-center gap-4">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-32 w-32 rounded-lg" />
				<Skeleton className="h-10 w-full max-w-xs" />
			</div>
		</div>
	);
}

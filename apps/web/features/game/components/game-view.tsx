import type { Id } from "@repo/convex/_generated/dataModel";
import { Skeleton } from "@repo/ui/registry/new-york-v4/ui/skeleton";
import { CountdownView } from "./countdown-view";
import { PlayingView } from "./playing-view";
import { RevealingView } from "./revealing-view";

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
						roomId={roomId}
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

	return renderRoundView();
}

export function GameViewSkeleton() {
	return (
		<div className="flex h-full flex-col">
			{/* Top: Player Avatars Skeleton */}
			<div className="flex shrink-0 items-center justify-center border-b px-4 py-3">
				<div className="flex flex-wrap items-center justify-center gap-4">
					{Array.from({ length: 3 }, (_, i) => `skeleton-avatar-${i}`).map(
						(key) => (
							<Skeleton key={key} className="size-16 rounded-full" />
						),
					)}
				</div>
			</div>

			{/* Center: Track Player Skeleton */}
			<div className="flex flex-1 items-center justify-center overflow-auto px-4">
				<Skeleton className="h-32 w-32 rounded-lg" />
			</div>

			{/* Bottom: Input Skeleton */}
			<div className="shrink-0 border-t bg-background p-4">
				<Skeleton className="h-10 w-full" />
			</div>
		</div>
	);
}

"use client";

import { convexQuery } from "@convex-dev/react-query";
import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@repo/ui/registry/new-york-v4/ui/avatar";
import { Badge } from "@repo/ui/registry/new-york-v4/ui/badge";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import {
	HomeIcon,
	RotateCcwIcon,
	TrophyIcon,
} from "@repo/ui/registry/web/icons";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface GameResultsProps {
	roomId: Id<"rooms">;
	gameId: Id<"games">;
	hostId: string;
}

export function GameResults({ roomId, gameId, hostId }: GameResultsProps) {
	const { data: session } = authClient.useSession();
	const router = useRouter();
	const {
		data: room,
		isLoading: isLoadingRoom,
		isError: isRoomError,
	} = useQuery(convexQuery(api.domains.rooms.queries.getRoom, { roomId }));
	const {
		data: gameScores,
		isLoading: isLoadingScores,
		isError: isScoresError,
	} = useQuery(convexQuery(api.domains.game.queries.getGameScores, { gameId }));

	const resetToWaiting = useMutation(api.domains.game.mutations.resetToWaiting);

	const isHost = session?.user?.id === hostId;

	const isLoading = isLoadingRoom || isLoadingScores;
	const hasError = isRoomError || isScoresError;

	if (hasError) {
		return (
			<div className="flex flex-1 items-center justify-center p-6 text-muted-foreground text-sm">
				Unable to load game results.
			</div>
		);
	}

	if (isLoading || !room || !gameScores) {
		return (
			<div className="flex flex-1 items-center justify-center p-6 text-muted-foreground text-sm">
				Loading results...
			</div>
		);
	}

	// Sort by total points descending
	const sortedScores = [...gameScores].sort(
		(a, b) => b.totalPoints - a.totalPoints,
	);
	const winner = sortedScores[0];
	const podium = sortedScores.slice(0, 3);

	const handleBackToLobby = () => {
		router.push("/");
	};

	const handlePlayAgain = async () => {
		await resetToWaiting({ roomId });
		// Page will auto-refresh due to Convex reactivity
	};

	const getMedalEmoji = (index: number) => {
		switch (index) {
			case 0:
				return "🥇";
			case 1:
				return "🥈";
			case 2:
				return "🥉";
			default:
				return "";
		}
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8 p-4">
			{/* Title */}
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="font-bold text-3xl tracking-tight md:text-4xl">
					Game Over!
				</h1>
				<p className="text-lg text-muted-foreground">{room.name}</p>
			</div>

			{/* Winner showcase */}
			{winner && (
				<div className="flex flex-col items-center gap-4">
					<div className="relative">
						<Avatar className="size-24 border-4 border-yellow-400 shadow-lg md:size-32">
							<AvatarImage src={winner.user?.image ?? undefined} />
							<AvatarFallback className="text-2xl md:text-3xl">
								{winner.user?.name?.[0]?.toUpperCase() ?? "1"}
							</AvatarFallback>
						</Avatar>
						<div className="-right-2 -top-2 absolute flex size-10 items-center justify-center rounded-full bg-yellow-400 text-xl shadow-lg">
							<TrophyIcon className="size-5 text-yellow-900" />
						</div>
					</div>
					<div className="flex flex-col items-center gap-1">
						<p className="font-bold text-xl">{winner.user?.name ?? "Winner"}</p>
						<Badge variant="secondary" className="text-lg">
							{winner.totalPoints.toLocaleString()} points
						</Badge>
					</div>
				</div>
			)}

			{/* Podium */}
			<div className="flex w-full max-w-md flex-col gap-3">
				{podium.map((score, index) => (
					<div
						key={score.userId}
						className={`flex items-center gap-4 rounded-xl border p-4 ${
							index === 0
								? "border-yellow-400/50 bg-yellow-400/10"
								: index === 1
									? "border-gray-400/50 bg-gray-400/10"
									: "border-amber-700/50 bg-amber-700/10"
						}`}
					>
						<span className="text-2xl">{getMedalEmoji(index)}</span>
						<Avatar className="size-10">
							<AvatarImage src={score.user?.image ?? undefined} />
							<AvatarFallback className="text-sm">
								{score.user?.name?.[0]?.toUpperCase() ?? index + 1}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<p className="font-medium">
								{score.user?.name ?? `Player ${index + 1}`}
							</p>
							<p className="text-muted-foreground text-xs">
								{score.artistsGuessed} artists • {score.titlesGuessed} titles
							</p>
						</div>
						<p className="font-bold font-mono text-lg">
							{score.totalPoints.toLocaleString()}
						</p>
					</div>
				))}
			</div>

			{/* All players (if more than 3) */}
			{sortedScores.length > 3 && (
				<div className="flex w-full max-w-md flex-col gap-2">
					<p className="text-muted-foreground text-sm">Other players</p>
					{sortedScores.slice(3).map((score, index) => (
						<div
							key={score.userId}
							className="flex items-center gap-3 rounded-lg border bg-card p-3"
						>
							<span className="w-6 text-center font-mono text-muted-foreground text-sm">
								{index + 4}
							</span>
							<Avatar className="size-8">
								<AvatarImage src={score.user?.image ?? undefined} />
								<AvatarFallback className="text-xs">
									{score.user?.name?.[0]?.toUpperCase() ?? index + 4}
								</AvatarFallback>
							</Avatar>
							<p className="flex-1 text-sm">
								{score.user?.name ?? `Player ${index + 4}`}
							</p>
							<p className="font-mono text-muted-foreground text-sm">
								{score.totalPoints.toLocaleString()}
							</p>
						</div>
					))}
				</div>
			)}

			{/* Actions */}
			<div className="flex gap-3">
				<Button variant="outline" onClick={handleBackToLobby}>
					<HomeIcon className="mr-2 size-4" />
					Back to Lobby
				</Button>
				{isHost && (
					<Button onClick={handlePlayAgain}>
						<RotateCcwIcon className="mr-2 size-4" />
						Play Again
					</Button>
				)}
			</div>

			{/* Note about changing playlist */}
			{isHost && (
				<p className="text-center text-muted-foreground text-sm">
					Tip: You can choose a different playlist for the next game!
				</p>
			)}
		</div>
	);
}

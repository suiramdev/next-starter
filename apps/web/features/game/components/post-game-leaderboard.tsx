"use client";

import type { Id } from "@repo/convex/_generated/dataModel";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@repo/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@repo/ui/registry/new-york-v4/ui/avatar";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/registry/new-york-v4/ui/card";
import { Skeleton } from "@repo/ui/registry/new-york-v4/ui/skeleton";
import { Trophy } from "@repo/ui/registry/web/icons";
import Link from "next/link";

interface PostGameLeaderboardProps {
	gameId: Id<"games">;
	roomId: Id<"rooms">;
}

export function PostGameLeaderboard({
	gameId,
	roomId,
}: PostGameLeaderboardProps) {
	const { data: gameScores, isLoading: isLoadingScores } = useQuery(
		convexQuery(api.domains.game.queries.getGameScores, { gameId }),
	);

	const { data: players, isLoading: isLoadingPlayers } = useQuery(
		convexQuery(api.domains.players.queries.listPlayers, { roomId }),
	);

	const isLoading = isLoadingScores || isLoadingPlayers;

	if (isLoading || !gameScores || !players) {
		return <PostGameLeaderboardSkeleton />;
	}

	// Combine game scores with player data
	const leaderboard = gameScores
		.map((score) => {
			const player = players.find((p) => p.userId === score.userId);
			return {
				...score,
				user: score.user ?? player?.user,
			};
		})
		.sort((a, b) => b.totalPoints - a.totalPoints);

	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<div className="flex shrink-0 items-center justify-center border-b px-4 py-4">
				<h1 className="font-semibold text-lg">Game Finished!</h1>
			</div>

			{/* Leaderboard */}
			<div className="flex flex-1 items-center justify-center overflow-auto px-4 py-4">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>Final Scores</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{leaderboard.map((entry, index) => {
							const playerName = entry.user?.name ?? `Player ${index + 1}`;
							const playerInitials = playerName
								.split(" ")
								.map((n) => n[0])
								.join("")
								.toUpperCase()
								.slice(0, 2);
							const isWinner = index === 0;

							return (
								<div
									key={entry.userId}
									className="flex items-center gap-4 rounded-lg border p-4"
								>
									<div className="flex items-center justify-center">
										{isWinner ? (
											<Trophy className="size-6 text-yellow-500" />
										) : (
											<span className="font-mono text-muted-foreground text-sm">
												#{index + 1}
											</span>
										)}
									</div>
									<Avatar className="size-10">
										<AvatarImage
											src={entry.user?.image ?? undefined}
											alt={playerName}
										/>
										<AvatarFallback className="font-semibold text-sm">
											{playerInitials}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<p className="font-medium text-sm">{playerName}</p>
										<p className="text-muted-foreground text-xs">
											{entry.artistsGuessed} artists • {entry.titlesGuessed}{" "}
											titles
										</p>
									</div>
									<div className="font-mono font-semibold text-lg">
										{entry.totalPoints}
									</div>
								</div>
							);
						})}
					</CardContent>
				</Card>
			</div>

			{/* Back to Lobby Button */}
			<div className="shrink-0 border-t bg-background p-4">
				<Button asChild className="w-full" size="lg">
					<Link href="/rooms">Back to Lobby</Link>
				</Button>
			</div>
		</div>
	);
}

function PostGameLeaderboardSkeleton() {
	return (
		<div className="flex h-full flex-col">
			<div className="flex shrink-0 items-center justify-center border-b px-4 py-4">
				<Skeleton className="h-6 w-32" />
			</div>
			<div className="flex flex-1 items-center justify-center overflow-auto px-4 py-4">
				<Card className="w-full max-w-md">
					<CardHeader>
						<Skeleton className="h-6 w-24" />
					</CardHeader>
					<CardContent className="space-y-4">
						{Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((key) => (
							<div key={key} className="flex items-center gap-4 rounded-lg border p-4">
								<Skeleton className="size-6" />
								<Skeleton className="size-10 rounded-full" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-3 w-32" />
								</div>
								<Skeleton className="h-6 w-12" />
							</div>
						))}
					</CardContent>
				</Card>
			</div>
			<div className="shrink-0 border-t bg-background p-4">
				<Skeleton className="h-12 w-full" />
			</div>
		</div>
	);
}


"use client";

import { convexQuery } from "@convex-dev/react-query";
import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@repo/ui/registry/new-york-v4/ui/avatar";
import { Skeleton } from "@repo/ui/registry/new-york-v4/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/registry/new-york-v4/ui/table";
import { CircleIcon, CrownIcon } from "@repo/ui/registry/web/icons";
import { RoundScoreIndicators } from "@repo/ui/registry/web/round-score-indicators";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

interface RoundScore {
	userId: string;
	points: number;
	guessedArtist: boolean;
	guessedTitle: boolean;
	artistGuessTime?: number;
	titleGuessTime?: number;
}

interface RoundLeaderboardSkeletonProps {
	showRoundDetails?: boolean;
}

function RoundLeaderboardSkeleton({
	showRoundDetails = false,
}: RoundLeaderboardSkeletonProps) {
	return (
		<div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
			<Skeleton className="h-5 w-24" />
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-8">#</TableHead>
						<TableHead>Player</TableHead>
						{showRoundDetails && (
							<TableHead className="text-center">Round</TableHead>
						)}
						<TableHead className="text-right">Total</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 3 }, (_, i) => `skeleton-score-${i}`).map(
						(key) => (
							<TableRow key={key}>
								<TableCell>
									<Skeleton className="h-4 w-4" />
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<Skeleton className="h-7 w-7 rounded-full" />
										<Skeleton className="h-4 w-24" />
									</div>
								</TableCell>
								{showRoundDetails && (
									<TableCell>
										<Skeleton className="mx-auto h-4 w-16" />
									</TableCell>
								)}
								<TableCell>
									<Skeleton className="ml-auto h-4 w-12" />
								</TableCell>
							</TableRow>
						),
					)}
				</TableBody>
			</Table>
		</div>
	);
}

interface RoundLeaderboardProps {
	roomId: Id<"rooms">;
	gameId: Id<"games">;
	roundId: Id<"rounds">;
	showRoundDetails?: boolean;
}

export function RoundLeaderboard({
	roomId,
	gameId,
	roundId,
	showRoundDetails = false,
}: RoundLeaderboardProps) {
	const { data: session } = authClient.useSession();

	const { data: gameScores, isLoading: isLoadingScores } = useQuery(
		convexQuery(api.domains.game.queries.getGameScores, { gameId }),
	);

	const { data: room } = useQuery(
		convexQuery(api.domains.rooms.queries.getRoom, { roomId }),
	);

	// Only fetch round scores if we're showing details (after round ends)
	const { data: roundScores } = useQuery({
		...convexQuery(api.domains.game.queries.getRoundScores, {
			roundId: showRoundDetails ? roundId : ("skip" as Id<"rounds">),
		}),
		enabled: showRoundDetails,
	});

	if (isLoadingScores || !gameScores || !room) {
		return <RoundLeaderboardSkeleton showRoundDetails={showRoundDetails} />;
	}

	// Create a map of round scores by userId
	const scoreMap = new Map<string, RoundScore>(
		roundScores?.map((s: RoundScore) => [s.userId, s]) ?? [],
	);

	// Sort by total points descending
	const sortedScores = [...gameScores].sort(
		(a, b) => b.totalPoints - a.totalPoints,
	);

	return (
		<div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
			<h3 className="font-semibold text-sm">Leaderboard</h3>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-8">#</TableHead>
						<TableHead>Player</TableHead>
						{showRoundDetails && (
							<TableHead className="text-center">Round</TableHead>
						)}
						<TableHead className="text-right">Total</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sortedScores.map((score, index) => {
						const roundScore = scoreMap.get(score.userId);
						const isCurrentUser = session?.user?.id === score.userId;

						return (
							<TableRow
								key={score.userId}
								className={isCurrentUser ? "bg-primary/5" : undefined}
							>
								<TableCell className="font-mono text-muted-foreground text-xs">
									{index + 1}
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<Avatar className="size-7">
											<AvatarImage
												src={score.user?.image ?? undefined}
												alt={score.user?.name ?? undefined}
											/>
											<AvatarFallback className="text-xs">
												{score.user?.name?.[0]?.toUpperCase() ?? index + 1}
											</AvatarFallback>
										</Avatar>
										<div className="flex min-w-0 items-center gap-1.5">
											<span className="truncate font-medium text-sm">
												{score.user?.name ?? `Player ${index + 1}`}
											</span>
											{score.userId === room.hostId && (
												<CrownIcon className="size-3 shrink-0 text-yellow-500" />
											)}
										</div>
									</div>
								</TableCell>
								{showRoundDetails && (
									<TableCell>
										{roundScore ? (
											<RoundScoreIndicators
												guessedArtist={roundScore.guessedArtist}
												guessedTitle={roundScore.guessedTitle}
												points={roundScore.points}
											/>
										) : (
											<div className="flex items-center justify-center gap-1">
												<CircleIcon className="size-4 text-muted-foreground/30" />
												<CircleIcon className="size-4 text-muted-foreground/30" />
											</div>
										)}
									</TableCell>
								)}
								<TableCell className="text-right font-mono font-semibold">
									{score.totalPoints.toLocaleString()}
								</TableCell>
							</TableRow>
						);
					})}
					{sortedScores.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={showRoundDetails ? 4 : 3}
								className="py-8 text-center text-muted-foreground"
							>
								No scores yet
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

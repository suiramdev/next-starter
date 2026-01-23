import { cn } from "@repo/ui/lib/utils";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@repo/ui/registry/new-york-v4/ui/avatar";
import { Badge } from "@repo/ui/registry/new-york-v4/ui/badge";
import { Skeleton } from "@repo/ui/registry/new-york-v4/ui/skeleton";

// Color palette for player circles
const PLAYER_COLORS = [
	"border-red-500",
	"border-green-500",
	"border-blue-500",
	"border-rose-500",
	"border-purple-500",
	"border-yellow-500",
	"border-orange-500",
	"border-pink-500",
	"border-cyan-500",
	"border-indigo-500",
];

interface PlayerWithScore {
	userId: string;
	user:
		| {
				id: string;
				name: string;
				image?: string;
			}
		| undefined;
	roundPoints: number;
}

interface RoundLeaderboardViewProps {
	players: PlayerWithScore[];
	isLoading?: boolean;
}

export function RoundLeaderboardView({
	players,
	isLoading,
}: RoundLeaderboardViewProps) {
	if (isLoading) {
		return <RoundLeaderboardViewSkeleton />;
	}

	if (players.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-wrap items-center justify-center gap-6">
			{players.map((player, index) => {
				const colorClass = PLAYER_COLORS[index % PLAYER_COLORS.length];
				const playerName = player.user?.name ?? `Player ${index + 1}`;
				const playerInitials = playerName
					.split(" ")
					.map((n) => n[0])
					.join("")
					.toUpperCase()
					.slice(0, 2);

				// Format score as "0" or "+<amount>"
				const scoreDisplay =
					player.roundPoints === 0
						? "0"
						: `+${player.roundPoints.toLocaleString()}`;

				return (
					<div key={player.userId} className="relative">
						{/* Colored circle border around avatar */}
						<div
							className={cn(
								"relative flex items-center justify-center rounded-full border-2",
								colorClass,
							)}
						>
							<Avatar>
								<AvatarImage
									src={player.user?.image}
									alt={playerName}
								/>
								<AvatarFallback className="font-semibold text-sm">
									{playerInitials}
								</AvatarFallback>
							</Avatar>
							{/* Score badge at top-right */}
							<Badge
								variant="secondary"
								className="-right-2 -top-2 absolute flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-background px-1.5 font-bold font-mono text-xs"
							>
								{scoreDisplay}
							</Badge>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export function RoundLeaderboardViewSkeleton() {
	return (
		<div className="flex justify-center gap-4">
			{Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((key) => (
				<Skeleton key={key} className="size-16 rounded-full" />
			))}
		</div>
	);
}


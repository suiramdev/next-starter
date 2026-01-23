"use client";

import { cn } from "@repo/ui/lib/utils";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@repo/ui/registry/new-york-v4/ui/avatar";
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

interface WaitingPlayersAvatarsProps {
	players?: Array<{
		id: string;
		userId: string;
		isHost: boolean;
		score: number;
		user?: {
			id: string;
			name: string;
			image?: string;
		};
	}>;
	isLoading?: boolean;
}

export function WaitingPlayersAvatars({
	players = [],
	isLoading,
}: WaitingPlayersAvatarsProps) {
	if (isLoading) {
		return (
			<div className="flex flex-wrap items-center justify-center gap-4">
				{Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((key) => (
					<Skeleton key={key} className="size-16 rounded-full" />
				))}
			</div>
		);
	}

	if (players.length === 0) {
		return (
			<div className="text-center text-muted-foreground">
				<p className="text-sm">No players yet</p>
			</div>
		);
	}

	return (
		<div className="flex flex-wrap items-center justify-center gap-4">
			{players.map((player, index) => {
				const colorClass = PLAYER_COLORS[index % PLAYER_COLORS.length];
				const playerName = player.user?.name ?? `Player ${index + 1}`;
				const playerInitials = playerName
					.split(" ")
					.map((n) => n[0])
					.join("")
					.toUpperCase()
					.slice(0, 2);

				return (
					<div
						key={player.id}
						className={cn(
							"relative flex items-center justify-center rounded-full border-2",
							colorClass,
						)}
					>
						<Avatar className="size-16">
							<AvatarImage
								src={player.user?.image ?? undefined}
								alt={playerName}
							/>
							<AvatarFallback className="font-semibold text-lg">
								{playerInitials}
							</AvatarFallback>
						</Avatar>
					</div>
				);
			})}
		</div>
	);
}


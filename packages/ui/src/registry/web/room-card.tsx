"use client";

import { cn } from "#src/lib/utils";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "#src/registry/new-york-v4/ui/avatar";
import { Button } from "#src/registry/new-york-v4/ui/button";
import { TrackImage } from "#src/registry/web/track-image";

interface RoomCardProps {
	name: string;
	playlistName?: string;
	playlistImage?: string;
	playerCount: number;
	players: {
		userId: string;
		name: string;
		image?: string;
	}[];
	onClick?: () => void;
	disabled?: boolean;
}

export function RoomCard({
	name,
	playlistName,
	playlistImage,
	playerCount,
	players,
	onClick,
	disabled,
}: RoomCardProps) {
	return (
		<Button
			variant="secondary"
			disabled={disabled}
			className={cn(
				"flex h-auto w-full flex-row items-start justify-start px-2 text-left",
			)}
			onClick={onClick}
		>
			{/* Squared playlist image on the left */}
			<div className="relative aspect-square h-full w-24 overflow-hidden rounded-sm">
				<TrackImage
					src={playlistImage}
					alt={playlistName ?? "Playlist cover"}
					fill
				/>
			</div>
			{/* Room information on the right */}
			<div className="flex h-full flex-1 flex-col items-start justify-between px-2">
				<div className="flex flex-col gap-1">
					<div className="font-semibold text-base leading-none">{name}</div>
					{playlistName && (
						<div className="text-muted-foreground text-xs">{playlistName}</div>
					)}
				</div>
				<div className="flex items-center gap-1.5">
					{players.slice(0, 3).map((player, index) => (
						<Avatar
							key={player.userId}
							className={cn(
								"size-6 border-2 border-background",
								index > 0 && "-ml-2",
							)}
						>
							<AvatarImage src={player.image ?? undefined} alt={player.name} />
							<AvatarFallback className="text-[10px]">
								{player.name?.charAt(0).toUpperCase() ?? "?"}
							</AvatarFallback>
						</Avatar>
					))}
					{playerCount > 3 && (
						<span className="ml-1 text-muted-foreground text-xs">
							+{playerCount - 3}
						</span>
					)}
				</div>
			</div>
		</Button>
	);
}

import Image from "next/image";
import { Avatar, AvatarFallback } from "#src/registry/new-york-v4/ui/avatar";
import { Badge } from "#src/registry/new-york-v4/ui/badge";
import { Button } from "#src/registry/new-york-v4/ui/button";
import { Skeleton } from "#src/registry/new-york-v4/ui/skeleton";
import { CrownIcon, DiscIcon } from "#src/registry/web/icons";

interface RoomPreviewCardProps {
	room: {
		name: string;
		playlistName?: string;
		playlistImage?: string;
		playlistAuthor?: string;
		playlistTotalTracks?: number;
		playerCount?: number;
		status?: string;
		code?: string;
	};
	players?: {
		id: string;
		name?: string;
		score: number;
		isHost: boolean;
	}[];
	onJoin: () => void;
}

export function RoomPreviewCard({
	room,
	players,
	onJoin,
}: RoomPreviewCardProps) {
	return (
		<div className="flex h-full flex-col">
			<div className="flex-1 space-y-6 overflow-y-auto">
				<h2 className="font-bold text-lg">{room.name}</h2>
				<div>
					{room.playlistName ? (
						<div className="flex items-center gap-3 rounded-lg border bg-card p-3">
							{room.playlistImage ? (
								<Image
									src={room.playlistImage}
									alt={room.playlistName}
									className="rounded-md object-cover shadow-md"
									width={56}
									height={56}
								/>
							) : (
								<div className="relative flex size-14 items-center justify-center rounded-md bg-primary/10">
									<DiscIcon className="size-6 text-muted-foreground" />
								</div>
							)}
							<div className="flex-1 overflow-hidden">
								<p className="truncate font-medium">{room.playlistName}</p>
								<p className="truncate text-muted-foreground text-xs">
									{room.playlistTotalTracks &&
										`${room.playlistTotalTracks} tracks`}
									{room.playlistTotalTracks && room.playlistAuthor && " • "}
									{room.playlistAuthor}
								</p>
							</div>
						</div>
					) : (
						<div className="flex items-center gap-3 rounded-lg border border-dashed bg-muted/30 p-3">
							<div className="relative flex size-14 items-center justify-center rounded-md bg-muted">
								<DiscIcon className="size-6 text-muted-foreground" />
							</div>
							<p className="text-muted-foreground text-sm italic">
								Host is choosing a playlist...
							</p>
						</div>
					)}
				</div>
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<h4 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
							Players
						</h4>
						<Badge
							variant="secondary"
							className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
						>
							{room.playerCount ?? 0}
						</Badge>
					</div>
					<div className="space-y-2">
						{players?.map((player, index) => (
							<div
								key={player.id}
								className="flex items-center gap-3 rounded-lg border bg-card p-2.5"
							>
								<Avatar className="size-9">
									<AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-xs">
										{player.name?.[0]?.toUpperCase() ?? index + 1}
										{player.name?.[1]?.toUpperCase() ?? ""}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 overflow-hidden">
									<p className="flex items-center gap-2 truncate font-medium text-sm">
										{player.name ?? `Player ${index + 1}`}
										{player.isHost && (
											<CrownIcon className="size-3.5 text-amber-500" />
										)}
									</p>
									<p className="text-muted-foreground text-xs">
										Score: {player.score}
									</p>
								</div>
							</div>
						))}
						{players?.length === 0 && (
							<p className="py-4 text-center text-muted-foreground text-sm italic">
								No players yet
							</p>
						)}
					</div>
				</div>
			</div>
			<div>
				<Button
					onClick={onJoin}
					className="w-full gap-2"
					size="lg"
					disabled={!room.code}
				>
					Join Room
				</Button>
			</div>
		</div>
	);
}

export function RoomPreviewCardSkeleton() {
	return (
		<div className="flex h-full flex-col">
			<div className="flex-1 space-y-6 overflow-y-auto">
				{/* Title skeleton */}
				<Skeleton className="h-7 w-3/4" />

				{/* Playlist card skeleton */}
				<div className="flex items-center gap-3 rounded-lg border bg-card p-3">
					<Skeleton className="size-14 rounded-md" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-2/3" />
						<Skeleton className="h-3 w-1/2" />
					</div>
				</div>

				{/* Players section skeleton */}
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-5 w-5 rounded-full" />
					</div>
					<div className="space-y-2"></div>
				</div>
			</div>
			<div>
				<Skeleton className="h-10 w-full rounded-md" />
			</div>
		</div>
	);
}

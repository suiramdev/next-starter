import type { Id } from "@repo/convex/_generated/dataModel";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/registry/new-york-v4/ui/card";
import { Skeleton } from "@repo/ui/registry/new-york-v4/ui/skeleton";
import { PlayersList } from "./players-list";
import { RoomStatus } from "./room-status";

interface RoomViewProps {
	room?: {
		_id: Id<"rooms">;
		name: string;
		isPrivate: boolean;
		status: "waiting" | "playing" | "finished";
		hostId: string;
		code?: string;
		playlistId?: string;
		playlistName?: string;
		playlistImage?: string;
		playlistAuthor?: string | null;
		playlistTotalTracks?: number;
		playerCount: number;
		isPlayer: boolean;
	};
	players?: Array<{
		id: Id<"players">;
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

export function RoomView({ room, players = [], isLoading }: RoomViewProps) {
	if (isLoading || !room) {
		return <RoomViewSkeleton />;
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Room Header */}
			<div className="flex flex-col gap-2">
				<h1 className="font-bold text-3xl tracking-tight">{room.name}</h1>
				<p className="text-muted-foreground">
					Waiting for players to join and the host to start the game
				</p>
			</div>

			{/* Room Status & Controls */}
			<RoomStatus roomId={room._id} room={room} isLoading={isLoading} />

			{/* Players List */}
			<Card>
				<CardHeader>
					<CardTitle>Players</CardTitle>
				</CardHeader>
				<CardContent>
					<PlayersList
						roomId={room._id}
						players={players}
						isLoading={isLoading}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

export function RoomViewSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			{/* Room Header Skeleton */}
			<div className="flex flex-col gap-2">
				<Skeleton className="h-9 w-64" />
				<Skeleton className="h-5 w-96" />
			</div>

			{/* Room Status Skeleton */}
			<Card className="backdrop-blur-sm">
				<CardContent className="flex flex-col gap-4 pt-6">
					<Skeleton className="h-5 w-32" />
					<div className="flex flex-col gap-2">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</div>
				</CardContent>
			</Card>

			{/* Players List Skeleton */}
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-20" />
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-3">
						{Array.from({ length: 3 }, (_, i) => `skeleton-player-${i}`).map(
							(key) => (
								<div key={key} className="flex items-center gap-3">
									<Skeleton className="h-8 w-8 rounded-full" />
									<Skeleton className="h-4 w-24" />
								</div>
							),
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

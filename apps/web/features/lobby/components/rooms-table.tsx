"use client";

import { api } from "@repo/convex/_generated/api";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/registry/new-york-v4/ui/table";
import { DiscIcon, LogInIcon, Users } from "@repo/ui/registry/web/icons";
import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type RoomsTableProps = {
	preloadedQuery: Preloaded<typeof api.domains.rooms.queries.listRooms>;
};

export function RoomsTable({ preloadedQuery }: RoomsTableProps) {
	const rooms = usePreloadedQuery(preloadedQuery);
	const joinRoom = useMutation(api.domains.rooms.mutations.joinRoom);
	const router = useRouter();

	const handleJoin = async (code: string | undefined) => {
		if (!code) return;
		try {
			const roomId = await joinRoom({ code });
			router.push(`/rooms/${roomId}`);
		} catch (error) {
			toast.error("Failed to join room");
			console.error(error);
		}
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Room</TableHead>
					<TableHead>Playlist</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Players</TableHead>
					<TableHead />
				</TableRow>
			</TableHeader>
			<TableBody>
				{rooms?.map((room) => (
					<TableRow
						key={room._id}
						className="group"
						onClick={() => handleJoin(room.code)}
					>
						<TableCell>
							<span className="font-medium">{room.name}</span>
						</TableCell>
						<TableCell>
							{room.playlistName ? (
								<div className="flex items-center gap-2">
									{room.playlistImage ? (
										<Image
											src={room.playlistImage}
											alt={room.playlistName}
											className="rounded object-cover"
											width={24}
											height={24}
										/>
									) : (
										<div className="relative aspect-square size-6 rounded-xs bg-primary/20">
											<DiscIcon className="absolute inset-0 m-auto size-3 text-muted-foreground" />
										</div>
									)}
									<span className="text-muted-foreground">
										{room.playlistName}
									</span>
								</div>
							) : (
								<span className="text-muted-foreground">
									Choosing a playlist...
								</span>
							)}
						</TableCell>
						<TableCell>
							<span className="text-muted-foreground">
								{room.status === "waiting"
									? "Waiting for players"
									: room.status === "playing"
										? "Playing"
										: "Finished"}
							</span>
						</TableCell>
						<TableCell>
							<div className="flex items-center gap-2 text-muted-foreground">
								<Users className="h-4 w-4" />
								<span>
									{room.players.length} player
									{room.players.length !== 1 ? "s" : ""}
								</span>
							</div>
						</TableCell>
						<TableCell className="text-right">
							<Button variant="outline" size="icon">
								<LogInIcon className="h-4 w-4" />
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

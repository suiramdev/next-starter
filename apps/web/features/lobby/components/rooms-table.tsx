"use client";

import { convexQuery } from "@convex-dev/react-query";
import { api } from "@repo/convex/_generated/api";
import { LogInIcon, Users } from "@repo/ui/registry/admin/icons";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { Skeleton } from "@repo/ui/registry/new-york-v4/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/registry/new-york-v4/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function RoomsTableSkeleton() {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Room Name</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Players</TableHead>
						<TableHead />
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 5 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton rows are static placeholders
						<TableRow key={`room-skeleton-${i}`} className="h-12">
							<TableCell>
								<Skeleton className="h-4 w-32" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-28" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-20" />
							</TableCell>
							<TableCell className="text-right">
								<Skeleton className="ml-auto h-8 w-16" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

export function RoomsTable() {
	const { data: rooms, isLoading: isLoadingRooms } = useQuery(
		convexQuery(api.queries.rooms.listRooms),
	);
	const joinRoom = useMutation(api.mutations.rooms.joinRoom);
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

	if (isLoadingRooms) {
		return <RoomsTableSkeleton />;
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Room Name</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Players</TableHead>
						<TableHead />
					</TableRow>
				</TableHeader>
				<TableBody>
					{rooms?.map((room) => (
						<TableRow
							key={room._id}
							className="h-12"
							onClick={() => handleJoin(room.code)}
						>
							<TableCell className="font-medium">{room.name}</TableCell>
							<TableCell className="text-muted-foreground">
								{room.status === "waiting"
									? "Waiting for players"
									: room.status === "playing"
										? "Playing"
										: "Finished"}
							</TableCell>
							<TableCell>
								<div className="flex items-center gap-2 text-muted-foreground">
									<Users className="h-4 w-4" />
									<span>
										{room.playerCount} player
										{room.playerCount !== 1 ? "s" : ""}
									</span>
								</div>
							</TableCell>
							<TableCell className="text-right">
								{room.isPrivate ? (
									<Button variant="ghost" size="sm" disabled>
										<LogInIcon className="h-4 w-4" />
										Join
									</Button>
								) : (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleJoin(room.code)}
									>
										<LogInIcon className="h-4 w-4" />
										Join
									</Button>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

"use client";

import { convexQuery } from "@convex-dev/react-query";
import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import {
	RoomPreviewCard,
	RoomPreviewCardSkeleton,
} from "@repo/ui/registry/web/room-preview-card";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RoomPreviewProps {
	roomId: Id<"rooms">;
}

export function RoomPreview({ roomId }: RoomPreviewProps) {
	const { data: room, isLoading } = useQuery(
		convexQuery(api.domains.rooms.queries.getRoom, { roomId }),
	);
	const { data: players } = useQuery(
		convexQuery(api.domains.players.queries.listPlayers, { roomId }),
	);
	const joinRoom = useMutation(api.domains.rooms.mutations.joinRoom);
	const router = useRouter();

	const handleJoin = async () => {
		if (!room?.code) return;

		try {
			const roomId = await joinRoom({ code: room.code });
			router.push(`/rooms/${roomId}`);
		} catch (error) {
			toast.error("Failed to join room");
			console.error(error);
		}
	};

	if (!room || isLoading) {
		return <RoomPreviewCardSkeleton />;
	}

	return <RoomPreviewCard room={room} players={players} onJoin={handleJoin} />;
}

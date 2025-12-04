import { getToken } from "@convex-dev/better-auth/nextjs";
import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import { createAuth } from "@repo/convex/domains/auth/setup";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { notFound, redirect } from "next/navigation";
import { ChatBox } from "@/features/rooms/components/chat-box";
import { InviteFriendsButton } from "@/features/rooms/components/invite-friends-button";
import { LeaveRoomButton } from "@/features/rooms/components/leave-room-button";
import { PlayersList } from "@/features/rooms/components/players-list";

interface RoomPageProps {
	params: Promise<{
		id: Id<"rooms">;
	}>;
}

export default async function RoomPage({ params }: RoomPageProps) {
	const { id } = await params;

	// Get auth token for server-side queries
	const token = await getToken(createAuth);
	if (!token) {
		redirect("/sign-in");
	}

	// Fetch room data server-side
	const room = await fetchQuery(api.domains.rooms.queries.getRoom, {
		roomId: id,
	});

	if (!room) {
		notFound();
	}

	// Preload room data for client-side
	const roomPreloadedQuery = await preloadQuery(
		api.domains.rooms.queries.getRoom,
		{
			roomId: id,
		},
		{ token: token },
	);

	const playersPreloadedQuery = await preloadQuery(
		api.domains.players.queries.listPlayers,
		{
			roomId: id,
		},
		{ token: token },
	);

	return (
		<div className="container mx-auto flex h-full flex-col overflow-hidden pb-6">
			<div className="flex items-center justify-between py-8">
				<h1 className="font-bold text-2xl tracking-tight">{room.name}</h1>
				<div className="flex items-center gap-2">
					<InviteFriendsButton roomId={id} />
					<LeaveRoomButton roomId={id} />
				</div>
			</div>
			<div className="flex h-full flex-col gap-8 md:flex-row">
				<PlayersList
					preloadedQuery={playersPreloadedQuery}
					hostId={room.hostId}
				/>
				<div className="flex h-full flex-col md:w-2/3">
					<ChatBox />
				</div>
			</div>
		</div>
	);
}

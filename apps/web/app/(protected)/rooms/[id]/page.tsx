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

	// Preload data for client-side
	const playersPreloadedQuery = await preloadQuery(
		api.domains.players.queries.listPlayers,
		{ roomId: id },
		{ token },
	);

	const messagesPreloadedQuery = await preloadQuery(
		api.domains.messages.queries.listMessages,
		{ roomId: id },
		{ token },
	);

	return (
		<div className="container mx-auto flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4 md:px-6 md:pb-6">
			{/* Header */}
			<header className="flex shrink-0 items-center justify-between py-4 md:py-6">
				<h1 className="font-bold text-xl tracking-tight md:text-2xl">
					{room.name}
				</h1>
				<div className="flex items-center gap-2">
					<InviteFriendsButton roomId={id} />
					<LeaveRoomButton roomId={id} />
				</div>
			</header>

			{/* Content - stacked on mobile, 50/50 on desktop */}
			<div className="flex min-h-0 flex-1 flex-col gap-4 md:flex-row md:gap-6">
				{/* Players - full width on mobile, half on desktop */}
				<aside className="min-h-0 shrink-0 overflow-auto md:w-1/2">
					<PlayersList
						preloadedQuery={playersPreloadedQuery}
						hostId={room.hostId}
					/>
				</aside>

				{/* Chat - full width on mobile, half on desktop */}
				<main className="min-h-0 min-w-0 flex-1 md:w-1/2">
					<ChatBox preloadedQuery={messagesPreloadedQuery} roomId={id} />
				</main>
			</div>
		</div>
	);
}

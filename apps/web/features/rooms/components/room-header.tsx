"use client";

import type { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import { LockIcon } from "@repo/ui/registry/web/icons";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { InviteFriendsButton } from "./invite-friends-button";
import { LeaveRoomButton } from "./leave-room-button";
import { RoomSettingsButton } from "./room-settings-button";

interface RoomHeaderProps {
	preloadedQuery: Preloaded<typeof api.domains.rooms.queries.getRoom>;
	roomId: Id<"rooms">;
}

export function RoomHeader({ preloadedQuery, roomId }: RoomHeaderProps) {
	const room = usePreloadedQuery(preloadedQuery);

	return (
		<header className="mb-6 flex shrink-0 items-center justify-between">
			<div className="flex items-center gap-2">
				<h1 className="font-bold text-xl tracking-tight md:text-2xl">
					{room.name}
				</h1>
				{room.isPrivate && (
					<LockIcon
						className="size-4 text-muted-foreground"
						aria-label="Private room"
					/>
				)}
			</div>
			<div className="flex items-center gap-2">
				<RoomSettingsButton preloadedQuery={preloadedQuery} roomId={roomId} />
				<InviteFriendsButton roomId={roomId} />
				<LeaveRoomButton roomId={roomId} />
			</div>
		</header>
	);
}

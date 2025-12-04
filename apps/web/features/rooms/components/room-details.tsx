"use client";

import type { api } from "@repo/convex/_generated/api";
import { type Preloaded, usePreloadedQuery } from "convex/react";

interface RoomDetailsProps {
	preloadedQuery: Preloaded<typeof api.domains.rooms.queries.getRoom>;
}

export function RoomDetails({ preloadedQuery }: RoomDetailsProps) {
	const room = usePreloadedQuery(preloadedQuery);

	return (
		<div>
			<h2 className="font-bold text-2xl tracking-tight">{room.name}</h2>
		</div>
	);
}

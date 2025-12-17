import { api } from "@repo/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { RoomsList } from "@/features/lobby/components/rooms-list";

export default async function ExplorePage() {
	const listRoomsQuery = await preloadQuery(
		api.domains.rooms.queries.listRooms,
	);

	return (
		<div className="flex h-full flex-col overflow-auto">
			<div className="flex h-full w-full flex-col space-y-8 p-4 md:p-6">
				<div>
					<h1 className="font-bold text-3xl tracking-tight">Explore</h1>
					<p className="mt-1 text-muted-foreground">
						Discover and join games from the community!
					</p>
				</div>
				<RoomsList preloadedQuery={listRoomsQuery} />
			</div>
		</div>
	);
}

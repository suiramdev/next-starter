import { api } from "@repo/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { CreateRoomDialog } from "@/features/lobby/components/create-room-dialog";
import { JoinRoomDialog } from "@/features/lobby/components/join-room-dialog";
import { RoomsList } from "@/features/lobby/components/rooms-list";

export default async function LobbyPage() {
	const listRoomsQuery = await preloadQuery(
		api.domains.rooms.queries.listRooms,
	);

	return (
		<div className="container mx-auto flex h-full w-full flex-col space-y-8 overflow-auto py-8">
			<div className="flex flex-col justify-between gap-4 md:flex-row">
				<div>
					<h1 className="font-bold text-3xl tracking-tight">Game Lobby</h1>
					<p className="mt-1 text-muted-foreground">
						Join a room or create your own to start playing!
					</p>
				</div>
				<div className="flex items-center gap-2">
					<JoinRoomDialog />
					<CreateRoomDialog />
				</div>
			</div>
			<RoomsList preloadedQuery={listRoomsQuery} />
		</div>
	);
}

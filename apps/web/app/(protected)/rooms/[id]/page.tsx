import type { Id } from "@repo/convex/_generated/dataModel";
import { WaitingRoom } from "@/features/rooms/components/waiting-room";

interface RoomPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function RoomPage({ params }: RoomPageProps) {
	const { id } = await params;

	return <WaitingRoom roomId={id as Id<"rooms">} />;
}

import type { Id } from "@repo/convex/_generated/dataModel";

interface RoomPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function RoomPage({ params }: RoomPageProps) {
	const { id } = await params;

	return <div>RoomPage</div>;
}

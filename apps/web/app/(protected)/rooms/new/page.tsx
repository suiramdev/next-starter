import { CreateRoomForm } from "@/features/rooms/components/create-room-form";

export default function CreateRoomPage() {
	return (
		<>
			<div className="mb-6">
				<h1 className="font-bold text-2xl">Create a New Room</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Start a new game room for others to join.
				</p>
			</div>
			<CreateRoomForm />
		</>
	);
}

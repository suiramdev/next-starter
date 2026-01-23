"use client";

import { CreateRoomForm, CreateRoomFormActions } from "@/features/rooms/components/create-room-form";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";

export default function CreateRoomPage() {
	const router = useRouter();
	
	// We need to access the form context from CreateRoomForm
	// This is a workaround - we'll handle the form submission in the component
	return (
		<CreateRoomFormWithActions router={router} />
	);
}

function CreateRoomFormWithActions({ router }: { router: ReturnType<typeof useRouter> }) {
	return (
		<div className="flex h-full flex-col overflow-hidden">
			<div className="min-h-0 flex-1 overflow-auto">
				<div className="mb-6">
					<h1 className="font-bold text-2xl">Create a New Room</h1>
					<p className="mt-1 text-muted-foreground text-sm">
						Start a new game room for others to join.
					</p>
				</div>
				<CreateRoomForm router={router} />
			</div>
		</div>
	);
}

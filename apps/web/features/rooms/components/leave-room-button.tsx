"use client";

import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { LogOutIcon } from "@repo/ui/registry/web/icons";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LeaveRoomButtonProps {
	roomId: Id<"rooms">;
}

export function LeaveRoomButton({ roomId }: LeaveRoomButtonProps) {
	const leaveRoom = useMutation(api.domains.rooms.mutations.leaveRoom);
	const router = useRouter();

	const handleLeaveRoom = async () => {
		try {
			router.push("/");
			leaveRoom({ roomId: roomId });
		} catch (error) {
			toast.error("Failed to leave room");
			console.error(error);
		}
	};
	return (
		<Button variant="outline" onClick={handleLeaveRoom}>
			<LogOutIcon className="size-4" />
			Leave Room
		</Button>
	);
}

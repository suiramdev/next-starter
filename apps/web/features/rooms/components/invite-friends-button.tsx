"use client";

import type { Id } from "@repo/convex/_generated/dataModel";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { ShareIcon } from "@repo/ui/registry/web/icons";
import { toast } from "sonner";

interface InviteFriendsButtonProps {
	roomId: Id<"rooms">;
}

export function InviteFriendsButton({ roomId }: InviteFriendsButtonProps) {
	const handleShare = async () => {
		await navigator.clipboard.writeText(
			`${window.location.origin}/rooms/${roomId}`,
		);
		toast.success("Room URL copied to clipboard");
	};

	return (
		<Button onClick={handleShare}>
			<ShareIcon className="size-4" />
			Invite friends
		</Button>
	);
}

"use client";

import { MessageCircleIcon } from "#src/registry/web/icons";

export function ChatEmptyState() {
	return (
		<div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
			<div className="flex size-12 items-center justify-center rounded-full bg-muted">
				<MessageCircleIcon className="size-6 text-muted-foreground" />
			</div>
			<div>
				<p className="font-medium text-sm">No messages yet</p>
				<p className="text-muted-foreground text-xs">Start the conversation!</p>
			</div>
		</div>
	);
}


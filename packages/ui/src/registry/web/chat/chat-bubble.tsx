"use client";

import { cn } from "#src/lib/utils";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "#src/registry/new-york-v4/ui/avatar";

export interface ChatBubbleProps {
	content: string;
	isOwn: boolean;
	senderName: string;
	senderImage?: string;
	timestamp: number;
	showAvatar?: boolean;
	showName?: boolean;
}

function formatTime(timestamp: number) {
	return new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	}).format(new Date(timestamp));
}

export function ChatBubble({
	content,
	isOwn,
	senderName,
	senderImage,
	timestamp,
	showAvatar = true,
	showName = true,
}: ChatBubbleProps) {
	return (
		<div className={cn("flex gap-2", isOwn ? "flex-row-reverse" : "flex-row")}>
			{/* Avatar placeholder for alignment */}
			{!isOwn && (
				<div className="w-8">
					{showAvatar && (
						<Avatar className="size-8">
							<AvatarImage src={senderImage} alt={senderName} />
							<AvatarFallback className="text-xs">
								{senderName[0]?.toUpperCase()}
							</AvatarFallback>
						</Avatar>
					)}
				</div>
			)}

			{/* Message bubble */}
			<div
				className={cn(
					"flex max-w-[75%] flex-col gap-1",
					isOwn ? "items-end" : "items-start",
				)}
			>
				{showName && (
					<span className="px-1 text-muted-foreground text-xs">{senderName}</span>
				)}
				<div
					className={cn(
						"rounded-2xl px-3.5 py-2 text-sm",
						isOwn ? "bg-primary text-primary-foreground" : "bg-muted",
					)}
				>
					{content}
				</div>
				<span className="px-1 text-[10px] text-muted-foreground/70">
					{formatTime(timestamp)}
				</span>
			</div>
		</div>
	);
}


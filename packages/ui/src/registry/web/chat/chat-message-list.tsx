"use client";

import type * as React from "react";
import { cn } from "#src/lib/utils";
import { ScrollArea } from "#src/registry/new-york-v4/ui/scroll-area";

export interface ChatMessageListProps {
	className?: string;
	children?: React.ReactNode;
	scrollRef?: React.RefObject<HTMLDivElement>;
}

export function ChatMessageList({
	className,
	children,
	scrollRef,
}: ChatMessageListProps) {
	return (
		<ScrollArea className={cn("min-h-0 flex-1 px-4", className)}>
			<div ref={scrollRef} className="flex flex-col gap-4 py-4">
				{children}
			</div>
		</ScrollArea>
	);
}


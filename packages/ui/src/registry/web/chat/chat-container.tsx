"use client";

import type * as React from "react";
import { cn } from "#src/lib/utils";

export function ChatContainer({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"flex h-full min-h-0 flex-col overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

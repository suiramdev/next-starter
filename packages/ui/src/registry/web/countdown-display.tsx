"use client";

import type * as React from "react";

import { cn } from "#src/lib/utils";

interface CountdownDisplayProps {
	count: number;
	className?: string;
}

function CountdownDisplay({ count, className }: CountdownDisplayProps) {
	return (
		<div className={cn("flex flex-col items-center gap-4", className)}>
			<div
				key={count}
				className="flex size-32 animate-pulse items-center justify-center rounded-full bg-primary/20 md:size-40"
			>
				<span className="font-black text-7xl text-primary md:text-8xl">
					{count > 0 ? count : "🎵"}
				</span>
			</div>
			<p className="font-medium text-lg text-muted-foreground">
				{count > 0 ? "Get ready!" : "Listen carefully!"}
			</p>
		</div>
	);
}

export { CountdownDisplay };


import type * as React from "react";

import { cn } from "#src/lib/utils";

interface GameProgressBadgeProps {
	currentRound: number;
	totalRounds: number;
	className?: string;
}

function GameProgressBadge({
	currentRound,
	totalRounds,
	className,
}: GameProgressBadgeProps) {
	return (
		<div
			className={cn(
				"flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1",
				className,
			)}
		>
			<span className="font-semibold text-primary text-sm">
				Round {currentRound}
			</span>
			<span className="text-muted-foreground text-xs">/ {totalRounds}</span>
		</div>
	);
}

export { GameProgressBadge };


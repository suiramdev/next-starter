import type * as React from "react";

import { cn } from "#src/lib/utils";
import { Badge } from "@repo/ui/registry/new-york-v4/ui/badge";
import { CheckCircleIcon, CircleIcon } from "@repo/ui/registry/web/icons";

interface RoundScoreIndicatorsProps {
	guessedArtist: boolean;
	guessedTitle: boolean;
	points?: number;
	className?: string;
}

function RoundScoreIndicators({
	guessedArtist,
	guessedTitle,
	points,
	className,
}: RoundScoreIndicatorsProps) {
	return (
		<div
			className={cn("flex items-center justify-center gap-1", className)}
		>
			{guessedArtist ? (
				<CheckCircleIcon className="size-4 text-green-500" />
			) : (
				<CircleIcon className="size-4 text-muted-foreground/30" />
			)}
			{guessedTitle ? (
				<CheckCircleIcon className="size-4 text-green-500" />
			) : (
				<CircleIcon className="size-4 text-muted-foreground/30" />
			)}
			{points !== undefined && points > 0 && (
				<Badge variant="secondary" className="ml-1 text-xs">
					+{points}
				</Badge>
			)}
		</div>
	);
}

export { RoundScoreIndicators };


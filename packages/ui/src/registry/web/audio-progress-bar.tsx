import type * as React from "react";

import { cn } from "#src/lib/utils";

interface AudioProgressBarProps {
	progress: number;
	className?: string;
}

function AudioProgressBar({ progress, className }: AudioProgressBarProps) {
	return (
		<div
			className={cn("h-2 overflow-hidden rounded-full bg-muted", className)}
		>
			<div
				className="h-full bg-primary transition-all duration-200"
				style={{ width: `${progress}%` }}
			/>
		</div>
	);
}

export { AudioProgressBar };


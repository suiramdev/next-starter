"use client";

import type * as React from "react";

import { cn } from "#src/lib/utils";
import { MusicIcon } from "@repo/ui/registry/web/icons";

interface MusicVisualizerProps {
	isPlaying: boolean;
	className?: string;
}

function MusicVisualizer({ isPlaying, className }: MusicVisualizerProps) {
	return (
		<div className={cn("flex items-center justify-center py-8", className)}>
			<div className="relative flex items-center justify-center">
				{/* Animated rings */}
				{isPlaying && (
					<>
						<div className="absolute size-32 animate-ping rounded-full bg-primary/10 md:size-40" />
						<div
							className="absolute size-24 animate-ping rounded-full bg-primary/20 md:size-32"
							style={{ animationDelay: "0.2s" }}
						/>
					</>
				)}

				{/* Main icon */}
				<div className="relative z-10 flex size-20 items-center justify-center rounded-full bg-primary/20 md:size-24">
					<MusicIcon
						className={cn(
							"size-10 text-primary md:size-12",
							isPlaying && "animate-bounce",
						)}
					/>
				</div>
			</div>
		</div>
	);
}

export { MusicVisualizer };


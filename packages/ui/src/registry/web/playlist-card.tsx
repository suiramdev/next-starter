"use client";

import { cn } from "#src/lib/utils";
import { Skeleton } from "#src/registry/new-york-v4/ui/skeleton";
import { TrackImage } from "#src/registry/web/track-image";

interface PlaylistCardProps {
	name: string;
	image?: string;
	ownerName?: string;
	trackCount: number;
	isSelected?: boolean;
	onClick?: () => void;
	className?: string;
}

export function PlaylistCard({
	name,
	image,
	ownerName,
	trackCount,
	isSelected,
	onClick,
	className,
}: PlaylistCardProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex h-full w-40 shrink-0 flex-col gap-2 rounded-lg border p-3 text-left transition-colors",
				"hover:bg-accent",
				isSelected && "border-primary bg-accent",
				className,
			)}
		>
			<div className="relative aspect-square w-full overflow-hidden rounded-md">
				<TrackImage src={image} alt={name} fill />
			</div>
			<div className="flex min-w-0 flex-col gap-1">
				<div className="truncate font-medium text-sm">{name}</div>
				{ownerName && (
					<div className="truncate text-muted-foreground text-xs">
						{ownerName}
					</div>
				)}
				<div className="text-muted-foreground text-xs">{trackCount} tracks</div>
			</div>
		</button>
	);
}

export function PlaylistCardSkeleton({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"flex h-full w-40 shrink-0 flex-col gap-2 rounded-lg border p-3",
				className,
			)}
		>
			<div className="aspect-square w-full overflow-hidden rounded-md">
				<Skeleton className="h-full w-full" />
			</div>
			<div className="flex min-w-0 flex-col gap-1">
				<Skeleton className="h-4 w-3/4" />
				<Skeleton className="h-3 w-1/2" />
				<Skeleton className="h-3 w-1/3" />
			</div>
		</div>
	);
}

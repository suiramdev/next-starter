import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@repo/ui/registry/new-york-v4/ui/avatar";
import { CrownIcon } from "@repo/ui/registry/web/icons";
import type * as React from "react";
import { cn } from "#src/lib/utils";

interface PlayerScoreRowProps {
	rank: number;
	name: string;
	image?: string | null;
	points: number;
	isHost?: boolean;
	isCurrentUser?: boolean;
	className?: string;
}

function PlayerScoreRow({
	rank,
	name,
	image,
	points,
	isHost = false,
	isCurrentUser = false,
	className,
}: PlayerScoreRowProps) {
	return (
		<div
			className={cn(
				"flex items-center gap-3 rounded-lg border bg-card p-3",
				isCurrentUser && "bg-primary/5",
				className,
			)}
		>
			<span className="w-6 text-center font-mono text-muted-foreground text-sm">
				{rank}
			</span>
			<Avatar className="size-8">
				<AvatarImage src={image ?? undefined} alt={name} />
				<AvatarFallback className="text-xs">
					{name[0]?.toUpperCase() ?? rank}
				</AvatarFallback>
			</Avatar>
			<div className="flex min-w-0 flex-1 items-center gap-1.5">
				<span className="truncate text-sm">{name}</span>
				{isHost && <CrownIcon className="size-3 shrink-0 text-yellow-500" />}
			</div>
			<p className="font-mono font-semibold">{points.toLocaleString()}</p>
		</div>
	);
}

export { PlayerScoreRow };

"use client";

import type { Id } from "@repo/convex/_generated/dataModel";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@repo/ui/registry/new-york-v4/ui/avatar";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@repo/ui/registry/new-york-v4/ui/dropdown-menu";
import {
	BanIcon,
	CrownIcon,
	MoreHorizontalIcon,
	UserXIcon,
} from "@repo/ui/registry/web/icons";

interface Player {
	_id: Id<"players">;
	userId: string;
	name?: string;
	image?: string;
}

interface PlayerListProps {
	players: Player[];
	currentUserId?: string;
	hostId: string;
	onKick: (userId: string) => void;
	onBan: (userId: string) => void;
}

export function PlayerList({
	players,
	currentUserId,
	hostId,
	onKick,
	onBan,
}: PlayerListProps) {
	return (
		<div className="space-y-4">
			<h3 className="font-semibold text-foreground/90 text-lg">
				Players ({players.length})
			</h3>
			<div className="flex flex-col gap-2">
				{players.map((player) => {
					const isMe = player.userId === currentUserId;
					const isHost = player.userId === hostId;
					const amIHost = currentUserId === hostId;
					const canManage = amIHost && !isHost;

					return (
						<div
							key={player._id}
							className="group flex items-center justify-between rounded-md p-2 transition-colors hover:bg-secondary/50"
						>
							<div className="flex items-center gap-3">
								<Avatar>
									<AvatarImage src={player.image} alt={player.name} />
									<AvatarFallback>{player.name?.[0] || "?"}</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<span className="flex items-center gap-2 font-medium text-sm">
										<span className={isMe ? "text-primary" : "text-foreground"}>
											{player.name || `Player ${player.userId.slice(0, 4)}`}
										</span>
										{isHost && <CrownIcon className="size-3 text-yellow-500" />}
										{isMe && (
											<span className="text-muted-foreground text-xs">
												(You)
											</span>
										)}
									</span>
								</div>
							</div>

							{canManage && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 opacity-0 group-hover:opacity-100"
										>
											<MoreHorizontalIcon className="size-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem
											onClick={() => onKick(player.userId)}
											className="text-destructive"
										>
											<UserXIcon className="mr-2 size-4" />
											Kick
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => onBan(player.userId)}
											className="text-destructive"
										>
											<BanIcon className="mr-2 size-4" />
											Ban
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

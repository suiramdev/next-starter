"use client";

import type { api } from "@repo/convex/_generated/api";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/registry/new-york-v4/ui/table";
import {
	CrownIcon,
	MoreHorizontalIcon,
	UserXIcon,
} from "@repo/ui/registry/web/icons";
import { type Preloaded, usePreloadedQuery } from "convex/react";

interface PlayersListProps {
	preloadedQuery: Preloaded<typeof api.domains.players.queries.listPlayers>;
}

export function PlayersList({ preloadedQuery }: PlayersListProps) {
	const players = usePreloadedQuery(preloadedQuery);

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Player</TableHead>
					<TableHead>Score</TableHead>
					<TableHead />
				</TableRow>
			</TableHeader>
			<TableBody>
				{players.map((player, index) => {
					return (
						<TableRow key={player._id} className="group">
							<TableCell>
								<div className="flex items-center gap-3">
									<Avatar className="size-8">
										<AvatarImage
											src={player.user?.image ?? undefined}
											alt={player.user?.name ?? undefined}
										/>
										<AvatarFallback className="text-xs">
											{player.user?.name[0]?.toUpperCase() ?? index + 1}
										</AvatarFallback>
									</Avatar>
									<div className="flex items-center gap-2">
										<span className="font-medium text-sm">
											{player.user?.name ?? `Player ${index + 1}`}
										</span>
										{player.isHost && (
											<CrownIcon className="size-3.5 text-yellow-500" />
										)}
									</div>
								</div>
							</TableCell>
							<TableCell className="font-mono text-muted-foreground text-sm">
								{player.score}
							</TableCell>
							<TableCell className="text-right">
								<PlayerActionsMenu
									userId={player.userId}
									canManage={player.isHost}
								>
									<PlayerActionsMenuTrigger asChild>
										<Button variant="ghost" size="icon">
											<MoreHorizontalIcon className="size-4" />
										</Button>
									</PlayerActionsMenuTrigger>
								</PlayerActionsMenu>
							</TableCell>
						</TableRow>
					);
				})}
				{players.length === 0 && (
					<TableRow>
						<TableCell
							colSpan={3}
							className="py-8 text-center text-muted-foreground"
						>
							No players yet
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

interface PlayerActionsMenuProps {
	userId: string;
	canManage?: boolean;
	children: React.ReactNode;
}

function PlayerActionsMenu({
	canManage = true,
	children,
}: PlayerActionsMenuProps) {
	return (
		<DropdownMenu>
			{children}
			<DropdownMenuContent align="end">
				<DropdownMenuItem variant="destructive" disabled={!canManage}>
					<UserXIcon className="mr-2 size-4" />
					Kick
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

const PlayerActionsMenuTrigger = DropdownMenuTrigger;

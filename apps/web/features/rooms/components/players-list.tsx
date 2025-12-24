"use client";

import type { Id } from "@repo/convex/_generated/dataModel";
import { cn } from "@repo/ui/lib/utils";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@repo/ui/registry/new-york-v4/ui/avatar";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { Card, CardContent } from "@repo/ui/registry/new-york-v4/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@repo/ui/registry/new-york-v4/ui/dropdown-menu";
import { Skeleton } from "@repo/ui/registry/new-york-v4/ui/skeleton";
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
import { authClient } from "@/lib/auth-client";

interface PlayersListProps {
	roomId: Id<"rooms">;
	players?: Array<{
		id: string;
		userId: string;
		isHost: boolean;
		score: number;
		user?: {
			id: string;
			name: string;
			image?: string;
		};
	}>;
	isLoading?: boolean;
}

export function PlayersList({
	roomId: _roomId,
	players = [],
	isLoading,
}: PlayersListProps) {
	const { data: session } = authClient.useSession();

	// Get hostId from first player that is host
	const hostId = players.find((p) => p.isHost)?.userId;
	const isHost = hostId === session?.user?.id;

	if (isLoading) {
		return <PlayersListSkeleton />;
	}

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
				{players.map((player) => {
					return (
						<TableRow key={player.id} className="group">
							<TableCell>
								<div className="flex items-center gap-3">
									<Avatar className="size-8">
										<AvatarImage
											src={player.user?.image ?? undefined}
											alt={player.user?.name ?? undefined}
										/>
										<AvatarFallback className="text-xs">
											{player.user?.name?.[0]?.toUpperCase() ?? "?"}
										</AvatarFallback>
									</Avatar>
									<div className="flex items-center gap-2">
										<span className="font-medium text-sm">
											{player.user?.name ?? "Unknown"}
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
								{isHost && (
									<PlayerActionsMenu userId={player.userId}>
										<PlayerActionsMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className={cn(
													player.isHost && "pointer-events-none opacity-0",
												)}
											>
												<MoreHorizontalIcon className="size-4" />
											</Button>
										</PlayerActionsMenuTrigger>
									</PlayerActionsMenu>
								)}
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
	children: React.ReactNode;
}

function PlayerActionsMenu({ children }: PlayerActionsMenuProps) {
	return (
		<DropdownMenu>
			{children}
			<DropdownMenuContent align="end">
				<DropdownMenuItem variant="destructive">
					<UserXIcon className="mr-2 size-4" />
					Kick
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

const PlayerActionsMenuTrigger = DropdownMenuTrigger;

export function PlayersListSkeleton() {
	return (
		<Card>
			<CardContent className="flex flex-col gap-3 pt-6">
				<Skeleton className="h-5 w-24" />
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Player</TableHead>
							<TableHead>Score</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((key) => (
							<TableRow key={key}>
								<TableCell>
									<div className="flex items-center gap-3">
										<Skeleton className="h-8 w-8 rounded-full" />
										<Skeleton className="h-4 w-24" />
									</div>
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-12" />
								</TableCell>
								<TableCell />
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

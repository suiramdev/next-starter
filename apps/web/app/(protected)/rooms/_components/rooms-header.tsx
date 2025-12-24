"use client";

import { convexQuery } from "@convex-dev/react-query";
import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { SkipForward, XIcon } from "@repo/ui/registry/web/icons";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function RoomsHeader() {
	const pathname = usePathname();
	const roomId = pathname.split("/").pop() as Id<"rooms"> | undefined;
	const { data: session } = authClient.useSession();

	const { data: room } = useQuery({
		...convexQuery(api.domains.rooms.queries.getRoom, {
			roomId: roomId ?? ("skip" as Id<"rooms">),
		}),
		enabled: !!roomId,
	});

	const { data: game } = useQuery({
		...convexQuery(api.domains.game.queries.getCurrentGame, {
			roomId: roomId ?? ("skip" as Id<"rooms">),
		}),
		enabled: !!roomId && room?.status === "playing",
	});

	const { data: round } = useQuery({
		...convexQuery(api.domains.game.queries.getCurrentRound, {
			gameId: game?._id ?? ("skip" as Id<"games">),
		}),
		enabled: !!game?._id,
	});

	const skipRound = useMutation(api.domains.game.mutations.skipRound);

	const isHost = session?.user?.id === room?.hostId;
	const isPlaying = room?.status === "playing" && game && round;
	const canSkip = isPlaying && isHost;

	const handleSkipRound = async () => {
		if (!game?._id || !canSkip) return;

		try {
			await skipRound({ gameId: game._id });
			toast.success("Round skipped");
		} catch (error) {
			toast.error("Failed to skip round");
			console.error(error);
		}
	};

	const currentRound = round?.roundNumber ?? game?.completedRounds + 1 ?? 0;
	const totalRounds = game?.totalRounds ?? 0;

	return (
		<header className="container mx-auto mb-8">
			<div className="flex items-center justify-between">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/">
						<XIcon className="size-4" />
						<span className="sr-only">Close</span>
					</Link>
				</Button>

				{isPlaying && (
					<div className="flex items-center gap-4">
						<span className="text-muted-foreground text-sm">
							Round {currentRound} / {totalRounds}
						</span>
						{canSkip && (
							<Button
								variant="ghost"
								size="icon"
								onClick={handleSkipRound}
								title="Skip round"
							>
								<SkipForward className="size-4" />
								<span className="sr-only">Skip round</span>
							</Button>
						)}
					</div>
				)}
			</div>
		</header>
	);
}


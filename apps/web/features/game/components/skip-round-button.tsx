"use client";

import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { SkipForwardIcon } from "@repo/ui/registry/web/icons";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

interface SkipRoundButtonProps {
	gameId: Id<"games">;
	disabled?: boolean;
}

export function SkipRoundButton({
	gameId,
	disabled = false,
}: SkipRoundButtonProps) {
	const skipRound = useMutation(api.domains.game.mutations.skipRound);
	const [isSkipping, setIsSkipping] = useState(false);

	const handleSkipRound = async () => {
		if (isSkipping || disabled) return;

		setIsSkipping(true);
		try {
			await skipRound({ gameId });
			toast.success("Round skipped");
		} catch (error) {
			toast.error("Failed to skip round");
			console.error(error);
		} finally {
			setIsSkipping(false);
		}
	};

	return (
		<Button
			variant="outline"
			onClick={handleSkipRound}
			disabled={isSkipping || disabled}
		>
			<SkipForwardIcon className="size-4" />
			Skip Round
		</Button>
	);
}

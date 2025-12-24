"use client";

import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@repo/ui/registry/new-york-v4/ui/input-group";
import { ArrowRightIcon } from "@repo/ui/registry/web/icons";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";

interface GuessInputProps {
	gameId: Id<"games">;
	roundId: Id<"rounds">;
	disabled?: boolean;
	userGuessedArtist?: boolean;
	userGuessedTitle?: boolean;
}

type FeedbackState = {
	type: "success" | "error";
	message: string;
} | null;

export function GuessInput({
	gameId,
	roundId: _roundId,
	disabled,
	userGuessedArtist,
	userGuessedTitle,
}: GuessInputProps) {
	const [guess, setGuess] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [feedback, setFeedback] = useState<FeedbackState>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const submitGuess = useMutation(api.domains.game.mutations.submitGuess);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!guess.trim() || isSubmitting || disabled) return;

		setIsSubmitting(true);
		setFeedback(null);

		try {
			const result = await submitGuess({
				gameId,
				guess: guess.trim(),
			});

			if (result.correct) {
				const parts: string[] = [];
				if (result.guessedArtist) {
					parts.push(
						result.isFirstArtist
							? "🏆 First to guess artist!"
							: "✅ Artist correct!",
					);
				}
				if (result.guessedTitle) {
					parts.push(
						result.isFirstTitle
							? "🏆 First to guess title!"
							: "✅ Title correct!",
					);
				}
				if (result.pointsEarned > 0) {
					parts.push(`+${result.pointsEarned} points`);
				}

				setFeedback({
					type: "success",
					message: parts.join(" • "),
				});
			} else {
				setFeedback({
					type: "error",
					message: "Not quite... keep trying!",
				});
			}

			setGuess("");
			requestAnimationFrame(() => {
				inputRef.current?.focus();
			});
		} catch {
			setFeedback({
				type: "error",
				message: "Failed to submit guess",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	// Auto-clear feedback after 3 seconds
	if (feedback) {
		setTimeout(() => setFeedback(null), 3000);
	}

	// If user has guessed both, they're done for this round
	const hasGuessedBoth = userGuessedArtist && userGuessedTitle;

	// Dynamic placeholder based on what's left to guess
	const getPlaceholder = () => {
		if (disabled) return "Waiting...";
		if (hasGuessedBoth) return "You got both! Waiting for round to end...";
		if (userGuessedArtist) return "Type the track title...";
		if (userGuessedTitle) return "Type the artist name...";
		return "Type the artist or track title...";
	};

	return (
		<form onSubmit={handleSubmit}>
			<InputGroup>
				<InputGroupInput
					ref={inputRef}
					type="text"
					value={guess}
					onChange={(e) => setGuess(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={getPlaceholder()}
					disabled={disabled || isSubmitting}
					autoComplete="off"
				/>
				<InputGroupAddon align="inline-end">
					<InputGroupButton
						type="submit"
						size="icon-xs"
						disabled={!guess.trim() || isSubmitting}
						aria-label="Send guess"
					>
						<ArrowRightIcon className="size-4" />
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
		</form>
	);
}

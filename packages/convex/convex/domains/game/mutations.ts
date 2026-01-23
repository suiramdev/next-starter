import { v } from "convex/values";
import { internal } from "../../_generated/api";
import { internalMutation, mutation } from "../../_generated/server";
import {
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
} from "../../shared/errors";
import { authComponent } from "../auth/setup";

// Scoring constants
const POINTS_ARTIST = 500;
const POINTS_TITLE = 500;
const POINTS_SPEED_MAX = 300;
const ROUND_DURATION_MS = 30000; // 30 seconds per round

/**
 * Calculate speed bonus based on how quickly the guess was made
 */
function calculateSpeedBonus(guessTimeMs: number): number {
	// Max bonus at 0ms, decreasing linearly to 0 at ROUND_DURATION_MS
	const ratio = Math.max(0, 1 - guessTimeMs / ROUND_DURATION_MS);
	return Math.floor(POINTS_SPEED_MAX * ratio);
}

/**
 * Normalize a string for comparison (lowercase, remove special chars, trim)
 */
function normalizeString(str: string): string {
	return str
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // Remove diacritics
		.replace(/[^a-z0-9\s]/g, "") // Remove special chars
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * Check if a guess matches a target (fuzzy matching)
 */
function isCorrectGuess(guess: string, target: string): boolean {
	const normalizedGuess = normalizeString(guess);
	const normalizedTarget = normalizeString(target);

	// Exact match
	if (normalizedGuess === normalizedTarget) {
		return true;
	}

	// Check if guess contains target or vice versa (for partial matches)
	// e.g., "Taylor Swift" matches "Taylor"
	if (
		normalizedTarget.includes(normalizedGuess) &&
		normalizedGuess.length >= 3
	) {
		return true;
	}

	// Check if target starts with guess (at least 80% of target)
	if (
		normalizedTarget.startsWith(normalizedGuess) &&
		normalizedGuess.length >= normalizedTarget.length * 0.8
	) {
		return true;
	}

	return false;
}

/**
 * Submit a guess for the current round
 */
export const submitGuess = mutation({
	args: {
		gameId: v.id("games"),
		guess: v.string(),
	},
	returns: v.object({
		correct: v.boolean(),
		guessedArtist: v.boolean(),
		guessedTitle: v.boolean(),
		pointsEarned: v.number(),
		isFirstArtist: v.boolean(),
		isFirstTitle: v.boolean(),
	}),
	handler: async (ctx, args) => {
		const user = await authComponent.safeGetAuthUser(ctx);
		if (!user) {
			throw new UnauthorizedError();
		}

		const game = await ctx.db.get(args.gameId);
		if (!game) {
			throw new NotFoundError();
		}

		if (!game.currentRoundId) {
			throw new ForbiddenError();
		}

		const round = await ctx.db.get(game.currentRoundId);
		if (!round || round.status !== "playing") {
			throw new ForbiddenError();
		}

		// Check if user is a player in the room
		const player = await ctx.db
			.query("players")
			.withIndex("by_roomId_and_userId", (q) =>
				q.eq("roomId", game.roomId).eq("userId", user._id),
			)
			.unique();

		if (!player) {
			throw new ForbiddenError();
		}

		// Get or create round score for this player
		let roundScore = await ctx.db
			.query("roundScores")
			.withIndex("by_roundId_and_userId", (q) =>
				q.eq("roundId", round._id).eq("userId", user._id),
			)
			.unique();

		if (!roundScore) {
			const scoreId = await ctx.db.insert("roundScores", {
				roundId: round._id,
				gameId: args.gameId,
				userId: user._id,
				points: 0,
				guessedArtist: false,
				guessedTitle: false,
			});
			roundScore = await ctx.db.get(scoreId);
		}

		if (!roundScore) {
			throw new Error("Failed to create round score");
		}

		const guess = args.guess.trim();
		const now = Date.now();
		const guessTimeMs = round.startedAt ? now - round.startedAt : 0;

		let guessedArtist = false;
		let guessedTitle = false;
		let pointsEarned = 0;
		let isFirstArtist = false;
		let isFirstTitle = false;

		// Check artist guess (only if not already guessed by this player)
		if (!roundScore.guessedArtist && isCorrectGuess(guess, round.trackArtist)) {
			guessedArtist = true;
			pointsEarned += POINTS_ARTIST;
			pointsEarned += calculateSpeedBonus(guessTimeMs);

			// First to guess artist? (track who was first)
			if (!round.artistGuessedBy) {
				isFirstArtist = true;
				await ctx.db.patch(round._id, {
					artistGuessedBy: user._id,
				});
			}

			await ctx.db.patch(roundScore._id, {
				guessedArtist: true,
				artistGuessTime: guessTimeMs,
			});
		}

		// Check title guess (only if not already guessed by this player)
		if (!roundScore.guessedTitle && isCorrectGuess(guess, round.trackTitle)) {
			guessedTitle = true;
			pointsEarned += POINTS_TITLE;
			pointsEarned += calculateSpeedBonus(guessTimeMs);

			// First to guess title? (track who was first)
			if (!round.titleGuessedBy) {
				isFirstTitle = true;
				await ctx.db.patch(round._id, {
					titleGuessedBy: user._id,
				});
			}

			await ctx.db.patch(roundScore._id, {
				guessedTitle: true,
				titleGuessTime: guessTimeMs,
			});
		}

		// Update scores if points were earned
		if (pointsEarned > 0) {
			// Update round score
			await ctx.db.patch(roundScore._id, {
				points: roundScore.points + pointsEarned,
			});

			// Update game score
			const gameScore = await ctx.db
				.query("gameScores")
				.withIndex("by_gameId_and_userId", (q) =>
					q.eq("gameId", args.gameId).eq("userId", user._id),
				)
				.unique();

			if (!gameScore) {
				await ctx.db.insert("gameScores", {
					gameId: args.gameId,
					userId: user._id,
					totalPoints: pointsEarned,
					roundsPlayed: 0,
					artistsGuessed: guessedArtist ? 1 : 0,
					titlesGuessed: guessedTitle ? 1 : 0,
				});
			} else {
				await ctx.db.patch(gameScore._id, {
					totalPoints: gameScore.totalPoints + pointsEarned,
					artistsGuessed: gameScore.artistsGuessed + (guessedArtist ? 1 : 0),
					titlesGuessed: gameScore.titlesGuessed + (guessedTitle ? 1 : 0),
				});
			}

			// Update player's cumulative room score
			await ctx.db.patch(player._id, {
				score: player.score + pointsEarned,
			});
		}

		return {
			correct: guessedArtist || guessedTitle,
			guessedArtist,
			guessedTitle,
			pointsEarned,
			isFirstArtist,
			isFirstTitle,
		};
	},
});

/**
 * Internal mutation to create a new game
 */
export const createGame = internalMutation({
	args: {
		roomId: v.id("rooms"),
		playlistId: v.string(),
		playlistName: v.string(),
		playlistImage: v.optional(v.string()),
		playlistAuthor: v.optional(v.union(v.string(), v.null())),
		totalRounds: v.number(),
	},
	returns: v.id("games"),
	handler: async (ctx, args) => {
		const gameId = await ctx.db.insert("games", {
			roomId: args.roomId,
			playlistId: args.playlistId,
			playlistName: args.playlistName,
			playlistImage: args.playlistImage,
			playlistAuthor: args.playlistAuthor,
			status: "playing",
			totalRounds: args.totalRounds,
			completedRounds: 0,
			startedAt: Date.now(),
		});

		// Update room with current game
		await ctx.db.patch(args.roomId, {
			currentGameId: gameId,
			status: "playing",
		});

		return gameId;
	},
});

/**
 * Internal mutation to create a new round
 */
export const createRound = internalMutation({
	args: {
		gameId: v.id("games"),
		roundNumber: v.number(),
		trackId: v.string(),
		trackTitle: v.string(),
		trackArtist: v.string(),
		trackPreviewUrl: v.string(),
		trackImage: v.optional(v.string()),
	},
	returns: v.id("rounds"),
	handler: async (ctx, args) => {
		// Create the round in countdown status
		// The trackId in the round serves as the record of used tracks
		const roundId = await ctx.db.insert("rounds", {
			gameId: args.gameId,
			roundNumber: args.roundNumber,
			trackId: args.trackId,
			trackTitle: args.trackTitle,
			trackArtist: args.trackArtist,
			trackPreviewUrl: args.trackPreviewUrl,
			trackImage: args.trackImage,
			status: "countdown",
		});

		// Update game with current round
		await ctx.db.patch(args.gameId, {
			currentRoundId: roundId,
		});

		return roundId;
	},
});

/**
 * Internal mutation to start playing a round (after countdown)
 */
export const startRoundPlaying = internalMutation({
	args: {
		roundId: v.id("rounds"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const now = Date.now();
		await ctx.db.patch(args.roundId, {
			status: "playing",
			startedAt: now,
			endsAt: now + ROUND_DURATION_MS,
		});

		// Schedule round end
		await ctx.scheduler.runAt(
			now + ROUND_DURATION_MS,
			internal.domains.game.mutations.endRound,
			{ roundId: args.roundId },
		);

		return null;
	},
});

/**
 * Internal mutation to end a round and reveal the track
 */
export const endRound = internalMutation({
	args: {
		roundId: v.id("rounds"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const round = await ctx.db.get(args.roundId);
		if (!round || round.status !== "playing") {
			return null;
		}

		await ctx.db.patch(args.roundId, {
			status: "revealing",
		});

		// Schedule transition to next round after reveal period (5 seconds)
		const revealDuration = 5000;
		await ctx.scheduler.runAt(
			Date.now() + revealDuration,
			internal.domains.game.mutations.finishRound,
			{ roundId: args.roundId },
		);

		return null;
	},
});

/**
 * Internal mutation to finish a round and prepare for next
 */
export const finishRound = internalMutation({
	args: {
		roundId: v.id("rounds"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const round = await ctx.db.get(args.roundId);
		if (!round) {
			return null;
		}

		await ctx.db.patch(args.roundId, {
			status: "finished",
		});

		const game = await ctx.db.get(round.gameId);
		if (!game) {
			return null;
		}

		// Update rounds played for all players who participated
		const roundScores = await ctx.db
			.query("roundScores")
			.withIndex("by_roundId", (q) => q.eq("roundId", args.roundId))
			.collect();

		for (const score of roundScores) {
			const gameScore = await ctx.db
				.query("gameScores")
				.withIndex("by_gameId_and_userId", (q) =>
					q.eq("gameId", game._id).eq("userId", score.userId),
				)
				.unique();

			if (gameScore) {
				await ctx.db.patch(gameScore._id, {
					roundsPlayed: gameScore.roundsPlayed + 1,
				});
			}
		}

		const completedRounds = game.completedRounds + 1;

		await ctx.db.patch(game._id, {
			completedRounds,
		});

		// Check if game is over
		if (completedRounds >= game.totalRounds) {
			await ctx.db.patch(game._id, {
				status: "finished",
				currentRoundId: undefined,
				finishedAt: Date.now(),
			});

			// Update room status
			const room = await ctx.db.get(game.roomId);
			if (room) {
				await ctx.db.patch(room._id, {
					status: "finished",
				});
			}
		} else {
			// Start next round after a short delay
			await ctx.scheduler.runAfter(
				2000,
				internal.domains.game.actions.startNextRound,
				{ gameId: game._id },
			);
		}

		return null;
	},
});

/**
 * Host can skip to next round
 */
export const skipRound = mutation({
	args: {
		gameId: v.id("games"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const user = await authComponent.safeGetAuthUser(ctx);
		if (!user) {
			throw new UnauthorizedError();
		}

		const game = await ctx.db.get(args.gameId);
		if (!game) {
			throw new NotFoundError();
		}

		const room = await ctx.db.get(game.roomId);
		if (!room || room.hostId !== user._id) {
			throw new ForbiddenError();
		}

		if (!game.currentRoundId) {
			throw new ForbiddenError();
		}

		const round = await ctx.db.get(game.currentRoundId);
		if (!round || round.status === "finished") {
			throw new ForbiddenError();
		}

		// End the current round immediately
		await ctx.db.patch(round._id, {
			status: "revealing",
		});

		// Schedule finish
		await ctx.scheduler.runAfter(
			3000,
			internal.domains.game.mutations.finishRound,
			{ roundId: round._id },
		);

		return null;
	},
});

/**
 * Internal mutation to finish a game
 */
export const finishGame = internalMutation({
	args: {
		gameId: v.id("games"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const game = await ctx.db.get(args.gameId);
		if (!game) {
			return null;
		}

		await ctx.db.patch(args.gameId, {
			status: "finished",
			currentRoundId: undefined,
			finishedAt: Date.now(),
		});

		// Update room status
		await ctx.db.patch(game.roomId, {
			status: "finished",
		});

		return null;
	},
});

/**
 * Reset room to waiting state (for playing again)
 */
export const resetToWaiting = mutation({
	args: {
		roomId: v.id("rooms"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const user = await authComponent.safeGetAuthUser(ctx);
		if (!user) {
			throw new UnauthorizedError();
		}

		const room = await ctx.db.get(args.roomId);
		if (!room) {
			throw new NotFoundError();
		}

		if (room.hostId !== user._id) {
			throw new ForbiddenError();
		}

		// Reset room to waiting state
		await ctx.db.patch(args.roomId, {
			status: "waiting",
			currentGameId: undefined,
		});

		return null;
	},
});

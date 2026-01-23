import { v } from "convex/values";
import { components } from "../../_generated/api";
import { internalQuery, query } from "../../_generated/server";
import { NotFoundError } from "../../shared/errors";

/**
 * Get the current game for a room
 */
export const getCurrentGame = query({
	args: {
		roomId: v.id("rooms"),
	},
	returns: v.union(
		v.null(),
		v.object({
			_id: v.id("games"),
			playlistId: v.string(),
			playlistName: v.string(),
			playlistImage: v.optional(v.string()),
			playlistAuthor: v.optional(v.union(v.string(), v.null())),
			status: v.union(v.literal("playing"), v.literal("finished")),
			currentRoundId: v.optional(v.id("rounds")),
			totalRounds: v.number(),
			completedRounds: v.number(),
			startedAt: v.number(),
			finishedAt: v.optional(v.number()),
		}),
	),
	handler: async (ctx, args) => {
		const room = await ctx.db.get(args.roomId);
		if (!room) {
			throw new NotFoundError();
		}

		if (!room.currentGameId) {
			return null;
		}

		const game = await ctx.db.get(room.currentGameId);
		if (!game) {
			return null;
		}

		return {
			_id: game._id,
			playlistId: game.playlistId,
			playlistName: game.playlistName,
			playlistImage: game.playlistImage,
			playlistAuthor: game.playlistAuthor,
			status: game.status,
			currentRoundId: game.currentRoundId,
			totalRounds: game.totalRounds,
			completedRounds: game.completedRounds,
			startedAt: game.startedAt,
			finishedAt: game.finishedAt,
		};
	},
});

/**
 * Get the current round for a game.
 * IMPORTANT: Track metadata (title, artist) is personalized per user:
 * - During play: Only shows answers the CURRENT USER has guessed correctly
 * - After round ends: Shows full answer to everyone
 */
export const getCurrentRound = query({
	args: {
		gameId: v.id("games"),
	},
	returns: v.union(
		v.null(),
		v.object({
			_id: v.id("rounds"),
			roundNumber: v.number(),
			status: v.union(
				v.literal("countdown"),
				v.literal("playing"),
				v.literal("revealing"),
				v.literal("finished"),
			),
			// Preview URL is always available for audio playback
			trackPreviewUrl: v.string(),
			// These are personalized - only shown if THIS user guessed or round is over
			trackTitle: v.optional(v.string()),
			trackArtist: v.optional(v.string()),
			trackImage: v.optional(v.string()),
			// Personal reveal state for current user
			userGuessedArtist: v.boolean(),
			userGuessedTitle: v.boolean(),
			// Global stats - who was first (only shown after round ends)
			artistGuessedBy: v.optional(v.string()),
			titleGuessedBy: v.optional(v.string()),
			// Timing
			startedAt: v.optional(v.number()),
			endsAt: v.optional(v.number()),
		}),
	),
	handler: async (ctx, args) => {
		const game = await ctx.db.get(args.gameId);
		if (!game) {
			throw new NotFoundError();
		}

		if (!game.currentRoundId) {
			return null;
		}

		const round = await ctx.db.get(game.currentRoundId);
		if (!round) {
			return null;
		}

		// Get current user's identity
		const user = await ctx.auth.getUserIdentity();
		const userId = user?.subject;

		// Check if current user has guessed artist/title
		let userGuessedArtist = false;
		let userGuessedTitle = false;

		if (userId) {
			const roundScore = await ctx.db
				.query("roundScores")
				.withIndex("by_roundId_and_userId", (q) =>
					q.eq("roundId", round._id).eq("userId", userId),
				)
				.unique();

			if (roundScore) {
				userGuessedArtist = roundScore.guessedArtist;
				userGuessedTitle = roundScore.guessedTitle;
			}
		}

		// Determine what track data to expose based on round status AND user's guesses
		const isRevealing =
			round.status === "revealing" || round.status === "finished";

		return {
			_id: round._id,
			roundNumber: round.roundNumber,
			status: round.status,
			trackPreviewUrl: round.trackPreviewUrl,
			// Only expose title if THIS USER guessed it OR round is over
			trackTitle:
				userGuessedTitle || isRevealing ? round.trackTitle : undefined,
			// Only expose artist if THIS USER guessed it OR round is over
			trackArtist:
				userGuessedArtist || isRevealing ? round.trackArtist : undefined,
			// Only expose image when revealing
			trackImage: isRevealing ? round.trackImage : undefined,
			// Personal state
			userGuessedArtist,
			userGuessedTitle,
			// Global first-guesser info (only meaningful after round ends)
			artistGuessedBy: isRevealing ? round.artistGuessedBy : undefined,
			titleGuessedBy: isRevealing ? round.titleGuessedBy : undefined,
			startedAt: round.startedAt,
			endsAt: round.endsAt,
		};
	},
});

/**
 * Get scores for the current round
 */
export const getRoundScores = query({
	args: {
		roundId: v.id("rounds"),
	},
	returns: v.array(
		v.object({
			userId: v.string(),
			points: v.number(),
			guessedArtist: v.boolean(),
			guessedTitle: v.boolean(),
			artistGuessTime: v.optional(v.number()),
			titleGuessTime: v.optional(v.number()),
			user: v.union(
				v.null(),
				v.object({
					_id: v.string(),
					name: v.string(),
					image: v.optional(v.union(v.null(), v.string())),
				}),
			),
		}),
	),
	handler: async (ctx, args) => {
		const roundScores = await ctx.db
			.query("roundScores")
			.withIndex("by_roundId", (q) => q.eq("roundId", args.roundId))
			.collect();

		const enrichedScores = await Promise.all(
			roundScores.map(async (score) => {
				const user = await ctx.runQuery(
					components.betterAuth.queries.users.getUser,
					{ userId: score.userId },
				);

				return {
					userId: score.userId,
					points: score.points,
					guessedArtist: score.guessedArtist,
					guessedTitle: score.guessedTitle,
					artistGuessTime: score.artistGuessTime,
					titleGuessTime: score.titleGuessTime,
					user: user
						? {
								_id: user._id,
								name: user.name,
								image: user.image,
							}
						: null,
				};
			}),
		);

		// Sort by points descending
		return enrichedScores.sort((a, b) => b.points - a.points);
	},
});

/**
 * Get game scores (leaderboard for current game)
 */
export const getGameScores = query({
	args: {
		gameId: v.id("games"),
	},
	returns: v.array(
		v.object({
			userId: v.string(),
			totalPoints: v.number(),
			roundsPlayed: v.number(),
			artistsGuessed: v.number(),
			titlesGuessed: v.number(),
			user: v.union(
				v.null(),
				v.object({
					_id: v.string(),
					name: v.string(),
					image: v.optional(v.union(v.null(), v.string())),
				}),
			),
		}),
	),
	handler: async (ctx, args) => {
		const gameScores = await ctx.db
			.query("gameScores")
			.withIndex("by_gameId", (q) => q.eq("gameId", args.gameId))
			.collect();

		const enrichedScores = await Promise.all(
			gameScores.map(async (score) => {
				const user = await ctx.runQuery(
					components.betterAuth.queries.users.getUser,
					{ userId: score.userId },
				);

				return {
					userId: score.userId,
					totalPoints: score.totalPoints,
					roundsPlayed: score.roundsPlayed,
					artistsGuessed: score.artistsGuessed,
					titlesGuessed: score.titlesGuessed,
					user: user
						? {
								_id: user._id,
								name: user.name,
								image: user.image,
							}
						: null,
				};
			}),
		);

		// Sort by total points descending
		return enrichedScores.sort((a, b) => b.totalPoints - a.totalPoints);
	},
});

/**
 * Get game progress for display
 */
export const getGameProgress = query({
	args: {
		gameId: v.id("games"),
	},
	returns: v.object({
		currentRound: v.number(),
		totalRounds: v.number(),
		status: v.union(v.literal("playing"), v.literal("finished")),
	}),
	handler: async (ctx, args) => {
		const game = await ctx.db.get(args.gameId);
		if (!game) {
			throw new NotFoundError();
		}

		return {
			currentRound: game.completedRounds + 1,
			totalRounds: game.totalRounds,
			status: game.status,
		};
	},
});

/**
 * Internal query to get game data for actions
 */
export const getGameInternal = internalQuery({
	args: {
		gameId: v.id("games"),
	},
	returns: v.union(
		v.null(),
		v.object({
			_id: v.id("games"),
			roomId: v.id("rooms"),
			playlistId: v.string(),
			status: v.union(v.literal("playing"), v.literal("finished")),
			totalRounds: v.number(),
			completedRounds: v.number(),
		}),
	),
	handler: async (ctx, args) => {
		const game = await ctx.db.get(args.gameId);
		if (!game) {
			return null;
		}

		return {
			_id: game._id,
			roomId: game.roomId,
			playlistId: game.playlistId,
			status: game.status,
			totalRounds: game.totalRounds,
			completedRounds: game.completedRounds,
		};
	},
});

/**
 * Internal query to get room data for actions
 */
export const getRoomInternal = internalQuery({
	args: {
		roomId: v.id("rooms"),
	},
	returns: v.union(
		v.null(),
		v.object({
			_id: v.id("rooms"),
			hostId: v.string(),
			currentGameId: v.optional(v.id("games")),
		}),
	),
	handler: async (ctx, args) => {
		const room = await ctx.db.get(args.roomId);
		if (!room) {
			return null;
		}

		return {
			_id: room._id,
			hostId: room.hostId,
			currentGameId: room.currentGameId,
		};
	},
});

/**
 * Internal query to get used track IDs for a game (from rounds)
 */
export const getUsedTrackIds = internalQuery({
	args: {
		gameId: v.id("games"),
	},
	returns: v.array(v.string()),
	handler: async (ctx, args) => {
		const rounds = await ctx.db
			.query("rounds")
			.withIndex("by_gameId", (q) => q.eq("gameId", args.gameId))
			.collect();

		return rounds.map((round) => round.trackId);
	},
});

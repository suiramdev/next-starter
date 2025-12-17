import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	rooms: defineTable({
		name: v.string(),
		code: v.string(),
		hostId: v.string(), // userId
		isPrivate: v.boolean(),
		status: v.union(
			v.literal("waiting"),
			v.literal("playing"),
			v.literal("finished"),
		),
		// Current game reference
		currentGameId: v.optional(v.id("games")),
		// Playlist selection for NEXT game (can be changed between games)
		playlistId: v.optional(v.string()),
		playlistName: v.optional(v.string()),
		playlistImage: v.optional(v.string()),
		playlistAuthor: v.optional(v.union(v.string(), v.null())),
		playlistTotalTracks: v.optional(v.number()),
	})
		.index("by_status", ["status"])
		.index("by_code", ["code"]),
	players: defineTable({
		roomId: v.id("rooms"),
		userId: v.string(),
		score: v.number(), // Cumulative score across all games in this room
	})
		.index("by_roomId", ["roomId"])
		.index("by_userId", ["userId"])
		.index("by_roomId_and_userId", ["roomId", "userId"]),
	messages: defineTable({
		roomId: v.id("rooms"),
		userId: v.string(),
		content: v.string(),
	}).index("by_roomId", ["roomId"]),
	// A game instance within a room - each game has its own playlist and rounds
	games: defineTable({
		roomId: v.id("rooms"),
		// Playlist locked at game start (cannot change mid-game)
		playlistId: v.string(),
		playlistName: v.string(),
		playlistImage: v.optional(v.string()),
		playlistAuthor: v.optional(v.union(v.string(), v.null())),
		// Game state
		status: v.union(v.literal("playing"), v.literal("finished")),
		currentRoundId: v.optional(v.id("rounds")),
		totalRounds: v.number(),
		completedRounds: v.number(),
		// Timestamps
		startedAt: v.number(),
		finishedAt: v.optional(v.number()),
	})
		.index("by_roomId", ["roomId"])
		.index("by_roomId_and_status", ["roomId", "status"]),
	// Game rounds - track metadata is protected until revealed
	rounds: defineTable({
		gameId: v.id("games"), // Now linked to game, not room
		roundNumber: v.number(),
		// Track data - protected fields (not exposed until revealed)
		trackId: v.string(), // Spotify track ID
		trackTitle: v.string(),
		trackArtist: v.string(),
		trackImage: v.optional(v.string()),
		// Preview URL - this is the only audio exposed to clients
		trackPreviewUrl: v.string(),
		// Round state
		status: v.union(
			v.literal("countdown"), // 3-2-1 countdown before track plays
			v.literal("playing"), // Track is playing, users can guess
			v.literal("revealing"), // Round ended, showing results
			v.literal("finished"), // Round complete, ready for next
		),
		startedAt: v.optional(v.number()),
		endsAt: v.optional(v.number()),
		// Track who was first to guess (for first bonus / display)
		artistGuessedBy: v.optional(v.string()), // userId who guessed artist first
		titleGuessedBy: v.optional(v.string()), // userId who guessed title first
	})
		.index("by_gameId", ["gameId"])
		.index("by_gameId_and_roundNumber", ["gameId", "roundNumber"])
		.index("by_gameId_and_trackId", ["gameId", "trackId"]),
	// Per-round scores for each player
	roundScores: defineTable({
		roundId: v.id("rounds"),
		gameId: v.id("games"),
		userId: v.string(),
		points: v.number(),
		guessedArtist: v.boolean(),
		guessedTitle: v.boolean(),
		artistGuessTime: v.optional(v.number()), // ms since round started
		titleGuessTime: v.optional(v.number()),
	})
		.index("by_roundId", ["roundId"])
		.index("by_roundId_and_userId", ["roundId", "userId"])
		.index("by_gameId", ["gameId"]),
	// Per-game scores for leaderboard
	gameScores: defineTable({
		gameId: v.id("games"),
		userId: v.string(),
		totalPoints: v.number(),
		roundsPlayed: v.number(),
		artistsGuessed: v.number(),
		titlesGuessed: v.number(),
	})
		.index("by_gameId", ["gameId"])
		.index("by_gameId_and_userId", ["gameId", "userId"]),
});

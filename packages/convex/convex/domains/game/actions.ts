"use node";

import { v } from "convex/values";
import { internal } from "../../_generated/api";
import { internalAction } from "../../_generated/server";
import {
	fetchPlaylistTracks,
	fetchTrackPreviewUrl,
	type Track,
} from "../../lib/spotify";
import { NotFoundError } from "../../shared/errors";

/**
 * Start the next round by selecting a random unplayed track
 */
export const startNextRound = internalAction({
	args: {
		gameId: v.id("games"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		// Get game data
		const game = await ctx.runQuery(
			internal.domains.game.queries.getGameInternal,
			{ gameId: args.gameId },
		);

		if (!game) {
			throw new NotFoundError();
		}

		if (game.status !== "playing") {
			return null;
		}

		// Get room to find host for Spotify access
		const room = await ctx.runQuery(
			internal.domains.game.queries.getRoomInternal,
			{ roomId: game.roomId },
		);

		if (!room) {
			throw new NotFoundError();
		}

		// Get access token using host's Spotify
		const accessToken = await ctx.runAction(
			internal.domains.spotify.actions.getSpotifyAccessTokenForRoom,
			{ roomId: game.roomId },
		);

		// Fetch all playlist tracks (without preview URLs) directly using utility function
		const allTracks = await fetchPlaylistTracks(game.playlistId, accessToken);

		if (allTracks.length === 0) {
			throw new Error("No tracks found in playlist");
		}

		// Get used tracks for this game
		const usedTrackIds = await ctx.runQuery(
			internal.domains.game.queries.getUsedTrackIds,
			{ gameId: args.gameId },
		);

		// Filter out used tracks
		const availableTracks = allTracks.filter(
			(track: Track) => !usedTrackIds.includes(track.id),
		);

		if (availableTracks.length === 0) {
			// All tracks have been used, end the game
			await ctx.runMutation(internal.domains.game.mutations.finishGame, {
				gameId: args.gameId,
			});
			return null;
		}

		// Try to find a track with a preview URL
		// Shuffle available tracks to randomize selection
		const shuffledTracks = [...availableTracks].sort(() => Math.random() - 0.5);

		const maxRetries = Math.min(10, shuffledTracks.length);
		let selectedTrack: Track | null = null;
		let previewUrl: string | null = null;

		// Try up to maxRetries tracks to find one with a preview URL
		for (let i = 0; i < maxRetries; i++) {
			const candidateTrack = shuffledTracks[i];
			if (!candidateTrack) {
				continue;
			}

			// Fetch preview URL for this track
			const url = await fetchTrackPreviewUrl(
				candidateTrack.name,
				candidateTrack.artists,
				candidateTrack.id,
			);

			if (url) {
				selectedTrack = candidateTrack;
				previewUrl = url;
				break;
			}
		}

		// If no track with preview URL found after retries, throw error
		if (!selectedTrack || !previewUrl) {
			throw new Error(
				"No playable tracks found with preview URLs. Please try a different playlist.",
			);
		}

		const roundNumber = game.completedRounds + 1;

		// Create the round
		const roundId = await ctx.runMutation(
			internal.domains.game.mutations.createRound,
			{
				gameId: args.gameId,
				roundNumber,
				trackId: selectedTrack.id,
				trackTitle: selectedTrack.name,
				trackArtist: selectedTrack.artists.join(", "),
				trackPreviewUrl: previewUrl,
				trackImage: selectedTrack.albumImage,
			},
		);

		// Schedule countdown transition (3 seconds)
		await ctx.scheduler.runAfter(
			3000,
			internal.domains.game.mutations.startRoundPlaying,
			{ roundId },
		);

		return null;
	},
});

/**
 * Start a new game - called when host clicks start
 */
// @ts-expect-error - TypeScript circular reference false positive
export const startGame = internalAction({
	args: {
		roomId: v.id("rooms"),
		playlistId: v.string(),
		playlistName: v.string(),
		playlistImage: v.optional(v.string()),
		playlistAuthor: v.optional(v.union(v.string(), v.null())),
		totalRounds: v.optional(v.number()),
	},
	returns: v.id("games"),
	// @ts-expect-error - TypeScript circular reference false positive
	handler: async (ctx, args) => {
		const totalRounds = args.totalRounds ?? 10;

		// Create the game
		// @ts-expect-error - TypeScript circular reference false positive
		const gameId = await ctx.runMutation(
			internal.domains.game.mutations.createGame,
			{
				roomId: args.roomId,
				playlistId: args.playlistId,
				playlistName: args.playlistName,
				playlistImage: args.playlistImage,
				playlistAuthor: args.playlistAuthor,
				totalRounds,
			},
		);

		// Start first round
		await ctx.runAction(internal.domains.game.actions.startNextRound, {
			gameId,
		});

		return gameId;
	},
});

/**
 * End the game early
 */
export const endGame = internalAction({
	args: {
		gameId: v.id("games"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const game = await ctx.runQuery(
			internal.domains.game.queries.getGameInternal,
			{ gameId: args.gameId },
		);

		if (!game) {
			throw new NotFoundError();
		}

		await ctx.runMutation(internal.domains.game.mutations.finishGame, {
			gameId: args.gameId,
		});

		return null;
	},
});

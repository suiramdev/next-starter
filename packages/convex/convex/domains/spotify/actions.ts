"use node";

import { v } from "convex/values";
import { z } from "zod";
import { components, internal } from "../../_generated/api";
import { action, internalAction } from "../../_generated/server";
import { NotFoundError, UnauthorizedError } from "../../shared/errors";
import { authComponent } from "../auth/setup";

export const getSpotifyAccessToken = internalAction({
	args: {},
	returns: v.string(),
	handler: async (ctx) => {
		const user = await authComponent.safeGetAuthUser(ctx);

		if (!user) {
			throw new UnauthorizedError();
		}

		const account = await ctx.runQuery(
			components.betterAuth.queries.spotify.getSpotifyAccount,
			{ userId: user._id },
		);

		if (!account) {
			throw new NotFoundError();
		}

		// Check if token is expired (with 60s buffer)
		const isExpired =
			account.accessTokenExpiresAt &&
			account.accessTokenExpiresAt < Date.now() + 60000;

		if (!isExpired && account.accessToken) {
			return account.accessToken;
		}

		// Token expired, refresh it
		if (!account.refreshToken) {
			throw new Error("No refresh token available. Please re-link Spotify.");
		}

		const clientId = process.env.SPOTIFY_CLIENT_ID;
		const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

		if (!clientId || !clientSecret) {
			throw new Error("Spotify credentials not configured");
		}

		const response = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
			},
			body: new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: account.refreshToken,
			}),
		});

		if (!response.ok) {
			const error = await response.text();
			console.error("Failed to refresh Spotify token:", error);
			throw new Error(
				"Failed to refresh Spotify token. Please re-link Spotify.",
			);
		}

		const data = await response.json();
		const newAccessToken = data.access_token;
		const expiresIn = data.expires_in; // seconds

		// Update the token in the database
		await ctx.runMutation(
			components.betterAuth.mutations.spotify.updateSpotifyToken,
			{
				accountId: account._id,
				accessToken: newAccessToken,
				accessTokenExpiresAt: Date.now() + expiresIn * 1000,
			},
		);

		return newAccessToken;
	},
});

const spotifyImageSchema = z.object({
	url: z.string(),
	height: z.number().nullable().optional(),
	width: z.number().nullable().optional(),
});

const spotifyPlaylistSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	collaborative: z.boolean().optional(),
	public: z.boolean().nullable().optional(),
	images: z.array(spotifyImageSchema).nullable().optional(),
	tracks: z.object({
		href: z.string(),
		total: z.number(),
	}),
	owner: z.object({
		id: z.string(),
		display_name: z.string().nullable().optional(),
		external_urls: z
			.object({
				spotify: z.string(),
			})
			.optional(),
		href: z.string().optional(),
		type: z.string().optional(),
		uri: z.string().optional(),
	}),
	external_urls: z
		.object({
			spotify: z.string(),
		})
		.optional(),
	href: z.string().optional(),
	uri: z.string().optional(),
	type: z.string().optional(),
	snapshot_id: z.string().optional(),
	primary_color: z.string().nullable().optional(),
});

const spotifySearchResponseSchema = z.object({
	playlists: z.object({
		items: z.array(spotifyPlaylistSchema.nullable()),
	}),
});

export const searchPlaylists = action({
	args: {
		query: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.safeGetAuthUser(ctx);

		if (!user) {
			throw new UnauthorizedError();
		}

		const accessToken = await ctx.runAction(
			internal.domains.spotify.actions.getSpotifyAccessToken,
		);

		const response = await fetch(
			`https://api.spotify.com/v1/search?type=playlist&q=${encodeURIComponent(args.query)}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		if (!response.ok) {
			const error = await response.text();
			console.error("Spotify API error:", error);
			throw new Error(`Failed to search playlists: ${response.statusText}`);
		}

		const data = await response.json();
		const parsed = spotifySearchResponseSchema.parse(data);

		return parsed.playlists.items.filter((item) => item !== null);
	},
});

const spotifyUserPlaylistsResponseSchema = z.object({
	href: z.string(),
	limit: z.number(),
	next: z.string().nullable(),
	offset: z.number(),
	previous: z.string().nullable(),
	total: z.number(),
	items: z.array(spotifyPlaylistSchema.nullable()),
});

export const getUserPlaylists = action({
	args: {
		limit: v.optional(v.number()),
		offset: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.safeGetAuthUser(ctx);

		if (!user) {
			throw new UnauthorizedError();
		}

		const accessToken = await ctx.runAction(
			internal.domains.spotify.actions.getSpotifyAccessToken,
		);

		const limit = args.limit ?? 50;
		const offset = args.offset ?? 0;
		const response = await fetch(
			`https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		if (!response.ok) {
			const error = await response.text();
			console.error("Spotify API error:", error);
			throw new Error(`Failed to get user playlists: ${response.statusText}`);
		}

		const data = await response.json();
		const parsed = spotifyUserPlaylistsResponseSchema.parse(data);

		return parsed.items.filter((item) => item !== null);
	},
});

/**
 * Get Spotify access token for a room (uses host's credentials)
 * This is an internal action used by the game system
 */
export const getSpotifyAccessTokenForRoom = internalAction({
	args: {
		roomId: v.id("rooms"),
	},
	returns: v.string(),
	handler: async (ctx, args): Promise<string> => {
		// Get the room to find the host
		const room = await ctx.runQuery(
			internal.domains.game.queries.getRoomInternal,
			{ roomId: args.roomId },
		);

		if (!room) {
			throw new NotFoundError();
		}

		// Get the host's Spotify account
		const account = await ctx.runQuery(
			components.betterAuth.queries.spotify.getSpotifyAccount,
			{ userId: room.hostId },
		);

		if (!account) {
			throw new Error("Host does not have Spotify linked");
		}

		// Check if token is expired (with 60s buffer)
		const isExpired =
			account.accessTokenExpiresAt &&
			account.accessTokenExpiresAt < Date.now() + 60000;

		if (!isExpired && account.accessToken) {
			return account.accessToken;
		}

		// Token expired, refresh it
		if (!account.refreshToken) {
			throw new Error(
				"No refresh token available. Host needs to re-link Spotify.",
			);
		}

		const clientId = process.env.SPOTIFY_CLIENT_ID;
		const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

		if (!clientId || !clientSecret) {
			throw new Error("Spotify credentials not configured");
		}

		const response = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
			},
			body: new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: account.refreshToken,
			}),
		});

		if (!response.ok) {
			const error = await response.text();
			console.error("Failed to refresh Spotify token:", error);
			throw new Error(
				"Failed to refresh Spotify token. Host needs to re-link Spotify.",
			);
		}

		const data = await response.json();
		const newAccessToken = data.access_token;
		const expiresIn = data.expires_in;

		// Update the token in the database
		await ctx.runMutation(
			components.betterAuth.mutations.spotify.updateSpotifyToken,
			{
				accountId: account._id,
				accessToken: newAccessToken,
				accessTokenExpiresAt: Date.now() + expiresIn * 1000,
			},
		);

		return newAccessToken;
	},
});

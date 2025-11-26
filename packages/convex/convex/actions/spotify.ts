"use node";

import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { v } from "convex/values";
import { z } from "zod";
import { components } from "../_generated/api";
import { type ActionCtx, action } from "../_generated/server";
import { authComponent } from "../auth";

function writeDebugData(filename: string, data: unknown) {
	const tmpDir = os.tmpdir();
	const filePath = path.join(tmpDir, filename);
	fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
	console.log(`Debug data written to: ${filePath}`);
}

async function getValidSpotifyToken(
	ctx: ActionCtx,
	userId: string,
): Promise<string> {
	const account = await ctx.runQuery(
		components.betterAuth.queries.spotify.getSpotifyAccount,
		{ userId },
	);

	if (!account) {
		throw new Error("Spotify not linked");
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
		throw new Error("Failed to refresh Spotify token. Please re-link Spotify.");
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
}

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
	images: z.array(spotifyImageSchema),
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

const spotifyMyPlaylistsResponseSchema = z.object({
	items: z.array(spotifyPlaylistSchema),
});

const spotifySearchResponseSchema = z.object({
	playlists: z.object({
		items: z.array(spotifyPlaylistSchema.nullable()),
	}),
});

export const getPlaylists = action({
	args: {},
	handler: async (ctx) => {
		const user = await authComponent.safeGetAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}

		const token = await getValidSpotifyToken(ctx, user._id);

		const response = await fetch("https://api.spotify.com/v1/me/playlists", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const error = await response.text();
			console.error("Spotify API error:", error);
			throw new Error(`Failed to fetch playlists: ${response.statusText}`);
		}

		const data = await response.json();
		const parsed = spotifyMyPlaylistsResponseSchema.parse(data);

		return parsed.items;
	},
});

export const searchPlaylists = action({
	args: {
		query: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.safeGetAuthUser(ctx);
		if (!user) {
			throw new Error("Unauthorized");
		}

		const token = await getValidSpotifyToken(ctx, user._id);

		const response = await fetch(
			`https://api.spotify.com/v1/search?type=playlist&q=${encodeURIComponent(args.query)}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
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

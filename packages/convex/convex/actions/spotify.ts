"use node";

import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { v } from "convex/values";
import { z } from "zod";
import { components } from "../_generated/api";
import { action } from "../_generated/server";
import { authComponent } from "../auth";

function writeDebugData(filename: string, data: unknown) {
	const tmpDir = os.tmpdir();
	const filePath = path.join(tmpDir, filename);
	fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
	console.log(`Debug data written to: ${filePath}`);
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

		const token = await ctx.runQuery(
			components.betterAuth.queries.spotify.getAccessToken,
			{
				userId: user._id,
			},
		);

		if (!token) {
			throw new Error("Spotify not linked");
		}

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

		const token = await ctx.runQuery(
			components.betterAuth.queries.spotify.getAccessToken,
			{
				userId: user._id,
			},
		);

		if (!token) {
			throw new Error("Spotify not linked");
		}

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
		writeDebugData("spotify-search-response.json", data);

		const parsed = spotifySearchResponseSchema.parse(data);

		return parsed.playlists.items.filter((item) => item !== null);
	},
});

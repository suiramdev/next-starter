import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { authComponent } from "../auth/setup";
import {
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
} from "../../shared/errors";

export const createRoom = mutation({
	args: {
		name: v.string(),
		isPrivate: v.boolean(),
		playlistId: v.optional(v.string()),
		playlistName: v.optional(v.string()),
		playlistImage: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.safeGetAuthUser(ctx);

		if (!user) {
			throw new UnauthorizedError();
		}

		const roomId = await ctx.db.insert("rooms", {
			name: args.name,
			code: Math.random().toString(36).substring(2, 8).toUpperCase(),
			hostId: user._id,
			isPrivate: args.isPrivate,
			status: "waiting",
			playlistId: args.playlistId,
			playlistName: args.playlistName,
			playlistImage: args.playlistImage,
		});

		await ctx.db.insert("players", {
			roomId,
			userId: user._id,
			score: 0,
		});

		return roomId;
	},
});

export const joinRoom = mutation({
	args: {
		code: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.safeGetAuthUser(ctx);

		if (!user) {
			throw new UnauthorizedError();
		}

		const room = await ctx.db
			.query("rooms")
			.withIndex("by_code_and_status", (q) =>
				q.eq("code", args.code).eq("status", "waiting"),
			)
			.unique();

		if (!room) {
			throw new NotFoundError();
		}

		const existingPlayer = await ctx.db
			.query("players")
			.withIndex("by_roomId_and_userId", (q) =>
				q.eq("roomId", room._id).eq("userId", user._id),
			)
			.unique();

		if (existingPlayer) {
			return room._id;
		}

		await ctx.db.insert("players", {
			roomId: room._id,
			userId: user._id,
			score: 0,
		});

		return room._id;
	},
});

export const updateRoom = mutation({
	args: {
		roomId: v.id("rooms"),
		name: v.optional(v.string()),
		isPrivate: v.optional(v.boolean()),
		playlistId: v.optional(v.string()),
		playlistName: v.optional(v.string()),
		playlistImage: v.optional(v.string()),
	},
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

		await ctx.db.patch(args.roomId, {
			...(args.name && { name: args.name }),
			...(args.isPrivate !== undefined && { isPrivate: args.isPrivate }),
			...(args.playlistId && { playlistId: args.playlistId }),
			...(args.playlistName && { playlistName: args.playlistName }),
			...(args.playlistImage && { playlistImage: args.playlistImage }),
		});
	},
});

export const kickUser = mutation({
	args: {
		roomId: v.id("rooms"),
		userId: v.string(),
	},
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

		// Prevent kicking the host
		if (args.userId === room.hostId) {
			throw new ForbiddenError();
		}

		const player = await ctx.db
			.query("players")
			.withIndex("by_roomId_and_userId", (q) =>
				q.eq("roomId", args.roomId).eq("userId", args.userId),
			)
			.unique();

		if (player) {
			await ctx.db.delete(player._id);
		}
	},
});

export const start = mutation({
	args: {
		roomId: v.id("rooms"),
	},
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

		await ctx.db.patch(args.roomId, {
			status: "playing",
		});
	},
});

export const leaveRoom = mutation({
	args: {
		roomId: v.id("rooms"),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.safeGetAuthUser(ctx);

		if (!user) {
			throw new UnauthorizedError();
		}

		const room = await ctx.db.get(args.roomId);
		if (!room) {
			throw new NotFoundError();
		}

		// Find and delete the player record
		const player = await ctx.db
			.query("players")
			.withIndex("by_roomId_and_userId", (q) =>
				q.eq("roomId", args.roomId).eq("userId", user._id),
			)
			.unique();

		if (player) {
			await ctx.db.delete(player._id);
		}

		// Get remaining players
		const remainingPlayers = await ctx.db
			.query("players")
			.withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
			.collect();

		// If the leaving user was the host, assign a new random host
		if (room.hostId === user._id) {
			const randomIndex = Math.floor(Math.random() * remainingPlayers.length);
			const newHost = remainingPlayers[randomIndex];

			// If no players left, delete the room
			if (!newHost) {
				await ctx.db.delete(args.roomId);
				return;
			}

			await ctx.db.patch(args.roomId, {
				hostId: newHost.userId,
			});
		}
	},
});


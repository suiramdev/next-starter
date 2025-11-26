import { v } from "convex/values";
import {
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
} from "#convex/utils/errors";
import { mutation } from "../_generated/server";
import { authComponent, createAuth } from "../auth";

export const createRoom = mutation({
	args: {
		name: v.string(),
		isPrivate: v.boolean(),
		playlistId: v.optional(v.string()),
		playlistName: v.optional(v.string()),
		playlistImage: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
		const session = await auth.api.getSession({ headers });

		if (!session) {
			throw new UnauthorizedError();
		}

		const userId = session.user.id;

		const roomId = await ctx.db.insert("rooms", {
			name: args.name,
			code: Math.random().toString(36).substring(2, 8).toUpperCase(),
			hostId: userId,
			isPrivate: args.isPrivate,
			status: "waiting",
			playlistId: args.playlistId,
			playlistName: args.playlistName,
			playlistImage: args.playlistImage,
		});

		await ctx.db.insert("players", {
			roomId,
			userId,
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
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
		const session = await auth.api.getSession({ headers });

		if (!session) {
			throw new UnauthorizedError();
		}

		const userId = session.user.id;

		const room = await ctx.db
			.query("rooms")
			.withIndex("by_code_and_status", (q) =>
				q.eq("code", args.code).eq("status", "waiting"),
			)
			.unique();

		if (!room) {
			throw new NotFoundError();
		}

		if (room.status !== "waiting") {
			throw new ForbiddenError();
		}

		const existingPlayer = await ctx.db
			.query("players")
			.withIndex("by_roomId_and_userId", (q) =>
				q.eq("roomId", room._id).eq("userId", userId),
			)
			.unique();

		if (existingPlayer) {
			return room._id;
		}

		await ctx.db.insert("players", {
			roomId: room._id,
			userId,
			score: 0,
		});

		return room._id;
	},
});

export const start = mutation({
	args: {
		roomId: v.id("rooms"),
	},
	handler: async (ctx, args) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
		const session = await auth.api.getSession({ headers });

		if (!session) {
			throw new UnauthorizedError();
		}

		const userId = session.user.id;

		const room = await ctx.db.get(args.roomId);
		if (!room) {
			throw new NotFoundError();
		}

		if (room.hostId !== userId) {
			throw new ForbiddenError();
		}

		await ctx.db.patch(args.roomId, {
			status: "playing",
		});
	},
});

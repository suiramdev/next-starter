import { v } from "convex/values";
import { query } from "../_generated/server";

export const getWaitingRooms = query({
	args: {},
	handler: async (ctx) => {
		const rooms = await ctx.db
			.query("rooms")
			.withIndex("by_status", (q) => q.eq("status", "waiting"))
			.filter((q) => q.eq(q.field("isPrivate"), false))
			.collect();

		// Fetch host names? For now just return rooms.
		return rooms;
	},
});

export const getRoom = query({
	args: {
		roomId: v.id("rooms"),
	},
	handler: async (ctx, args) => {
		const room = await ctx.db.get(args.roomId);
		if (!room) {
			return null;
		}

		const players = await ctx.db
			.query("players")
			.withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
			.collect();

		return {
			...room,
			players,
		};
	},
});

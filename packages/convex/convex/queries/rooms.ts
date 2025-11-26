import { v } from "convex/values";
import { query } from "../_generated/server";
import { authComponent } from "../auth";

export const listRooms = query({
	args: {},
	handler: async (ctx) => {
		const rooms = await ctx.db
			.query("rooms")
			.filter((q) => q.eq(q.field("isPrivate"), false))
			.collect();

		const roomsWithDetails = await Promise.all(
			rooms.map(async (room) => {
				const players = await ctx.db
					.query("players")
					.withIndex("by_roomId", (q) => q.eq("roomId", room._id))
					.collect();

				return {
					...room,
					// If the room is private, don't expose the code
					code: room.isPrivate ? undefined : room.code,
					playerCount: players.length,
				};
			}),
		);

		return roomsWithDetails;
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

		const user = await authComponent.getAuthUser(ctx);
		const userId = user?._id;

		const isPlayer = players.some((p) => p.userId === userId);
		const isHost = room.hostId === userId;
		const showCode = !room.isPrivate || isPlayer || isHost;

		return {
			...room,
			// If the room is private, don't expose the code
			code: showCode ? room.code : undefined,
			players,
		};
	},
});

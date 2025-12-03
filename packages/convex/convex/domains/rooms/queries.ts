import { v } from "convex/values";
import { query } from "../../_generated/server";
import { NotFoundError, UnauthorizedError } from "../../shared/errors";
import { authComponent } from "../auth/setup";

export const listRooms = query({
	args: {},
	returns: v.array(
		v.object({
			_id: v.id("rooms"),
			name: v.string(),
			status: v.union(
				v.literal("waiting"),
				v.literal("playing"),
				v.literal("finished"),
			),
			code: v.optional(v.string()),
			playlistId: v.optional(v.string()),
			playlistName: v.optional(v.string()),
			playlistImage: v.optional(v.string()),
			players: v.array(
				v.object({
					_id: v.id("players"),
					userId: v.string(),
					score: v.number(),
				}),
			),
		}),
	),
	handler: async (ctx) => {
		const rooms = await ctx.db.query("rooms").collect();

		const enrichedRooms = await Promise.all(
			rooms.map(async (room) => {
				const players = await ctx.db
					.query("players")
					.withIndex("by_roomId", (q) => q.eq("roomId", room._id))
					.collect();

				return {
					_id: room._id,
					name: room.name,
					// Omit the code if the room is private
					code: room.isPrivate ? undefined : room.code,
					status: room.status,
					playlistId: room.playlistId,
					playlistName: room.playlistName,
					playlistImage: room.playlistImage,
					players: players.map((player) => ({
						_id: player._id,
						userId: player.userId,
						score: player.score,
					})),
				};
			}),
		);

		return enrichedRooms;
	},
});

export const getRoom = query({
	args: {
		roomId: v.id("rooms"),
	},
	returns: v.object({
		_id: v.id("rooms"),
		name: v.string(),
		status: v.union(
			v.literal("waiting"),
			v.literal("playing"),
			v.literal("finished"),
		),
		hostId: v.string(),
		code: v.optional(v.string()),
		playlistId: v.optional(v.string()),
		playlistName: v.optional(v.string()),
		playlistImage: v.optional(v.string()),
		playlistAuthor: v.optional(v.union(v.string(), v.null())),
		players: v.array(
			v.object({
				_id: v.id("players"),
				userId: v.string(),
				score: v.number(),
			}),
		),
	}),
	handler: async (ctx, args) => {
		const user = await authComponent.safeGetAuthUser(ctx);

		if (!user) {
			throw new UnauthorizedError();
		}

		const room = await ctx.db.get(args.roomId);

		if (!room) {
			throw new NotFoundError();
		}

		const players = await ctx.db
			.query("players")
			.withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
			.collect();

		const isPlayer = players.some((p) => p.userId === user?._id);

		return {
			_id: room._id,
			name: room.name,
			// Omit the code if the room is private and the user is not a player
			code: !room.isPrivate || isPlayer ? room.code : undefined,
			status: room.status,
			hostId: room.hostId,
			playlistId: room.playlistId,
			playlistName: room.playlistName,
			playlistImage: room.playlistImage,
			playlistAuthor: room.playlistAuthor,
			players: players.map((player) => ({
				_id: player._id,
				userId: player.userId,
				score: player.score,
			})),
		};
	},
});

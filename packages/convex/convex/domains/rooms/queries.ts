import { v } from "convex/values";
import { components } from "../../_generated/api";
import { query } from "../../_generated/server";
import { NotFoundError } from "../../shared/errors";

export const listRooms = query({
	args: {},
	returns: v.array(
		v.object({
			_id: v.id("rooms"),
			name: v.string(),
			isPrivate: v.boolean(),
			status: v.union(
				v.literal("waiting"),
				v.literal("playing"),
				v.literal("finished"),
			),
			code: v.optional(v.string()),
			playlistId: v.optional(v.string()),
			playlistName: v.optional(v.string()),
			playlistImage: v.optional(v.string()),
			playlistAuthor: v.optional(v.union(v.string(), v.null())),
			playlistTotalTracks: v.optional(v.number()),
			playerCount: v.number(),
			players: v.array(
				v.object({
					userId: v.string(),
					name: v.string(),
					image: v.optional(v.string()),
				}),
			),
		}),
	),
	handler: async (ctx) => {
		const user = await ctx.auth.getUserIdentity();

		const rooms = await ctx.db.query("rooms").collect();

		const enrichedRooms = await Promise.all(
			rooms.map(async (room) => {
				const players = await ctx.db
					.query("players")
					.withIndex("by_roomId", (q) => q.eq("roomId", room._id))
					.collect();

				const isPlayer = players.some((p) => p.userId === user?._id);

				// Get user data for first 3 players
				const playerUsers = await Promise.all(
					players.slice(0, 3).map(async (player) => {
						const userData = await ctx.runQuery(
							components.betterAuth.queries.users.getUser,
							{
								userId: player.userId,
							},
						);
						return {
							userId: player.userId,
							name: userData?.name ?? "Unknown",
							image: userData?.image ?? undefined,
						};
					}),
				);

				return {
					_id: room._id,
					name: room.name,
					isPrivate: room.isPrivate,
					status: room.status,
					// Omit the code if the room is private and the user is not a player
					code: !room.isPrivate || isPlayer ? room.code : undefined,
					playlistId: room.playlistId,
					playlistName: room.playlistName,
					playlistImage: room.playlistImage,
					playlistAuthor: room.playlistAuthor,
					playlistTotalTracks: room.playlistTotalTracks,
					playerCount: players.length,
					players: playerUsers,
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
		isPrivate: v.boolean(),
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
		playlistTotalTracks: v.optional(v.number()),
		playerCount: v.number(),
	}),
	handler: async (ctx, args) => {
		const user = await ctx.auth.getUserIdentity();

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
			isPrivate: room.isPrivate,
			status: room.status,
			hostId: room.hostId,
			code: !room.isPrivate || isPlayer ? room.code : undefined,
			playlistId: room.playlistId,
			playlistName: room.playlistName,
			playlistImage: room.playlistImage,
			playlistAuthor: room.playlistAuthor,
			playlistTotalTracks: room.playlistTotalTracks,
			playerCount: players.length,
		};
	},
});

import { NotFoundError } from "convex/shared/errors";
import { v } from "convex/values";
import { components } from "../../_generated/api";
import { query } from "../../_generated/server";

export const listPlayers = query({
	args: {
		roomId: v.id("rooms"),
	},
	returns: v.array(
		v.object({
			_id: v.id("players"),
			userId: v.string(),
			isHost: v.boolean(),
			score: v.number(),
			user: v.union(
				v.null(),
				v.object({
					_id: v.string(),
					name: v.string(),
					image: v.optional(v.union(v.null(), v.string())),
				}),
			),
		}),
	),
	handler: async (ctx, args) => {
		const room = await ctx.db.get(args.roomId);

		if (!room) {
			throw new NotFoundError();
		}

		const players = await ctx.db
			.query("players")
			.withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
			.collect();

		const enrichedPlayers = await Promise.all(
			players.map(async (player) => {
				const user = await ctx.runQuery(
					components.betterAuth.queries.users.getUser,
					{
						userId: player.userId,
					},
				);

				return {
					_id: player._id,
					userId: player.userId,
					isHost: player.userId === room.hostId,
					score: player.score,
					user: user
						? {
								_id: user._id,
								name: user.name,
								image: user.image,
							}
						: null,
				};
			}),
		);

		return enrichedPlayers;
	},
});

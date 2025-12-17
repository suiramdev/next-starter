import { v } from "convex/values";
import { components } from "../../_generated/api";
import { query } from "../../_generated/server";
import { NotFoundError } from "../../shared/errors";

export const listPlayers = query({
	args: {
		roomId: v.id("rooms"),
	},
	returns: v.array(
		v.object({
			id: v.id("players"),
			userId: v.string(),
			isHost: v.boolean(),
			score: v.number(),
			user: v.optional(
				v.object({
					id: v.string(),
					name: v.string(),
					image: v.optional(v.string()),
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
					id: player._id,
					userId: player.userId,
					isHost: player.userId === room.hostId,
					score: player.score,
					user: user
						? {
								id: user._id,
								name: user.name,
								image: user.image ?? undefined,
							}
						: undefined,
				};
			}),
		);

		return enrichedPlayers;
	},
});

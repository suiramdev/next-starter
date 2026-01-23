import { v } from "convex/values";
import { components } from "../../_generated/api";
import { query } from "../../_generated/server";
import { NotFoundError } from "../../shared/errors";

export const listMessages = query({
	args: {
		roomId: v.id("rooms"),
	},
	returns: v.array(
		v.object({
			id: v.id("messages"),
			creationTime: v.number(),
			content: v.string(),
			userId: v.string(),
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

		const messages = await ctx.db
			.query("messages")
			.withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
			.order("asc")
			.collect();

		const enrichedMessages = await Promise.all(
			messages.map(async (message) => {
				const user = await ctx.runQuery(
					components.betterAuth.queries.users.getUser,
					{
						userId: message.userId,
					},
				);

				return {
					id: message._id,
					creationTime: message._creationTime,
					content: message.content,
					userId: message.userId,
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

		return enrichedMessages;
	},
});

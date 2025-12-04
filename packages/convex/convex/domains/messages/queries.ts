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
			_id: v.id("messages"),
			_creationTime: v.number(),
			content: v.string(),
			userId: v.string(),
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
					_id: message._id,
					_creationTime: message._creationTime,
					content: message.content,
					userId: message.userId,
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

		return enrichedMessages;
	},
});


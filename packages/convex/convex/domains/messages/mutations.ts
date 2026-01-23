import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../../shared/errors";
import { authComponent } from "../auth/setup";

export const sendMessage = mutation({
	args: {
		roomId: v.id("rooms"),
		content: v.string(),
	},
	returns: v.id("messages"),
	handler: async (ctx, args) => {
		const user = await authComponent.safeGetAuthUser(ctx);

		if (!user) {
			throw new UnauthorizedError();
		}

		const room = await ctx.db.get(args.roomId);

		if (!room) {
			throw new NotFoundError();
		}

		// Check if user is a player in the room
		const player = await ctx.db
			.query("players")
			.withIndex("by_roomId_and_userId", (q) =>
				q.eq("roomId", args.roomId).eq("userId", user._id),
			)
			.unique();

		if (!player) {
			throw new ForbiddenError();
		}

		const messageId = await ctx.db.insert("messages", {
			roomId: args.roomId,
			userId: user._id,
			content: args.content.trim(),
		});

		return messageId;
	},
});


import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const create = mutation({
	args: {
		userName: v.string(),
		userEmail: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await ctx.db.insert("user", {
			name: args.userName,
			email: args.userEmail,
			emailVerified: false,
			image: null,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});

		await ctx.db.patch(userId, {
			userId: userId,
		});

		return {
			userId: userId,
		};
	},
});

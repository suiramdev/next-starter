import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const updateSpotifyToken = mutation({
	args: {
		accountId: v.id("account"),
		accessToken: v.string(),
		accessTokenExpiresAt: v.number(),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.accountId, {
			accessToken: args.accessToken,
			accessTokenExpiresAt: args.accessTokenExpiresAt,
			updatedAt: Date.now(),
		});
	},
});

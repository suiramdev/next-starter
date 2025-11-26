import { v } from "convex/values";
import type { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";

export const updateSpotifyToken = mutation({
	args: {
		accountId: v.string(),
		accessToken: v.string(),
		accessTokenExpiresAt: v.number(),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.accountId as Id<"account">, {
			accessToken: args.accessToken,
			accessTokenExpiresAt: args.accessTokenExpiresAt,
			updatedAt: Date.now(),
		});
	},
});

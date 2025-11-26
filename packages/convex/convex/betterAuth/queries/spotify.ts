import { v } from "convex/values";
import { query } from "../_generated/server";

export const isLinked = query({
	args: {
		userId: v.string(),
	},
	handler: async (ctx, args) => {
		const account = await ctx.db
			.query("account")
			.withIndex("providerId_userId", (q) =>
				q.eq("providerId", "spotify").eq("userId", args.userId),
			)
			.first();

		return !!account;
	},
});

export const getSpotifyAccount = query({
	args: { userId: v.string() },
	handler: async (ctx, args) => {
		const account = await ctx.db
			.query("account")
			.withIndex("providerId_userId", (q) =>
				q.eq("providerId", "spotify").eq("userId", args.userId),
			)
			.first();

		if (!account) return null;

		return {
			_id: account._id,
			accessToken: account.accessToken,
			refreshToken: account.refreshToken,
			accessTokenExpiresAt: account.accessTokenExpiresAt,
		};
	},
});

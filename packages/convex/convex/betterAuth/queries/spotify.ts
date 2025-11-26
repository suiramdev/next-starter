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

export const getAccessToken = query({
	args: { userId: v.string() },
	handler: async (ctx, args) => {
		const account = await ctx.db
			.query("account")
			.withIndex("providerId_userId", (q) =>
				q.eq("providerId", "spotify").eq("userId", args.userId),
			)
			.first();

		return account?.accessToken;
	},
});

import { v } from "convex/values";
import { systemFields } from "convex-helpers/validators";
import { query } from "../_generated/server";
import schema from "../schema";

export const getSpotifyAccount = query({
	args: { userId: v.string() },
	returns: v.union(
		v.null(),
		v.object({
			...schema.tables.account.validator.fields,
			...systemFields("account"),
		}),
	),
	handler: async (ctx, args) => {
		return await ctx.db
			.query("account")
			.withIndex("providerId_userId", (q) =>
				q.eq("providerId", "spotify").eq("userId", args.userId),
			)
			.unique();
	},
});

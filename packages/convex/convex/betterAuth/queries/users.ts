import { v } from "convex/values";
import { query } from "../_generated/server";

export const getUser = query({
	args: {
		userId: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.db.get(args.userId as any);
		return user;
	},
});

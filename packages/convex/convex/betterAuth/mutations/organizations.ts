import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";

export const setDefaultActiveOrganization = mutation({
	args: {
		userId: v.id("user"),
	},
	handler: async (ctx, args) => {
		const member = await ctx.db
			.query("member")
			.withIndex("userId", (q) => q.eq("userId", args.userId))
			.first();

		if (!member) {
			throw new ConvexError({
				message: "Member not found",
				code: 404,
			});
		}

		const session = await ctx.db
			.query("session")
			.withIndex("userId", (q) => q.eq("userId", args.userId))
			.first();

		if (!session) {
			throw new ConvexError({
				message: "Session not found",
				code: 404,
			});
		}

		await ctx.db.patch(session._id, {
			activeOrganizationId: member?.organizationId,
		});
	},
});

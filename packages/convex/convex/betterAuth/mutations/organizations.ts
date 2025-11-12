import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const create = mutation({
	args: {
		organizationName: v.string(),
	},
	handler: async (ctx, args) => {
		const slug = args.organizationName
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");

		const organizationId = await ctx.db.insert("organization", {
			name: args.organizationName,
			slug: slug,
			createdAt: Date.now(),
		});

		return {
			organizationId: organizationId,
		};
	},
});

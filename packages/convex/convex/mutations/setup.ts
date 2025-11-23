import { ConvexError, v } from "convex/values";
import { api, components } from "../_generated/api";
import { mutation } from "../_generated/server";

export const setup = mutation({
	args: {
		organizationName: v.string(),
		name: v.string(),
		email: v.string(),
		password: v.string(),
	},
	handler: async (ctx, args) => {
		const isSetup = await ctx.runQuery(api.queries.setup.isSetup);

		if (isSetup) {
			throw new ConvexError({
				message: "Application already setup",
				code: 400,
			});
		}

		await ctx.runMutation(components.betterAuth.mutations.setup.setup, {
			organizationName: args.organizationName,
			name: args.name,
			email: args.email,
			password: args.password,
		});

		await ctx.db.insert("app_settings", {
			key: "is_setup",
			value: true,
			updatedAt: Date.now(),
		});
	},
});

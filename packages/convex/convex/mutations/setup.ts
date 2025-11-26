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

		const { organizationId } = await ctx.runMutation(
			components.betterAuth.mutations.setup.setup,
			{
				organizationName: args.organizationName,
				name: args.name,
				email: args.email,
				password: args.password,
			},
		);

		// Store default organization ID
		await ctx.db.insert("app_settings", {
			key: "defaultOrganizationId",
			value: organizationId,
			updatedAt: Date.now(),
		});

		// Configure organization settings for default organization
		await ctx.db.insert("organization_settings", {
			organizationId,
			key: "allowAnonymousLogin",
			value: true,
			updatedAt: Date.now(),
		});

		await ctx.db.insert("organization_settings", {
			organizationId,
			key: "allowUserSignUp",
			value: false,
			updatedAt: Date.now(),
		});

		await ctx.db.insert("app_settings", {
			key: "setupCompleted",
			value: true,
			updatedAt: Date.now(),
		});
	},
});

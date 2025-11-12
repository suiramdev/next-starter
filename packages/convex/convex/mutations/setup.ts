import { v } from "convex/values";
import { components } from "../_generated/api";
import { mutation } from "../_generated/server";

export const setup = mutation({
	args: {
		organizationName: v.string(),
		userEmail: v.string(),
		userPassword: v.string(),
		userName: v.string(),
	},
	handler: async (ctx, args) => {
		// Check if already setup
		const existingSetting = await ctx.db
			.query("app_settings")
			.withIndex("by_key", (q) => q.eq("key", "is_setup"))
			.first();

		if (existingSetting?.value === true) {
			throw new Error("Applicasetuption is already setup");
		}

		const organizationResult = await ctx.runMutation(
			components.betterAuth.mutations.organizations.create,
			{
				organizationName: args.organizationName,
			},
		);

		const userResult = await ctx.runMutation(
			components.betterAuth.mutations.users.create,
			{
				userName: args.userName,
				userEmail: args.userEmail,
			},
		);

		const accountResult = await ctx.runMutation(
			components.betterAuth.mutations.accounts.create,
			{
				userId: userResult.userId,
				userEmail: args.userEmail,
				userPassword: args.userPassword,
			},
		);

		const memberResult = await ctx.runMutation(
			components.betterAuth.mutations.members.create,
			{
				organizationId: organizationResult.organizationId,
				userId: userResult.userId,
				role: "admin",
			},
		);

		await ctx.db.insert("app_settings", {
			key: "is_setup",
			value: true,
			updatedAt: Date.now(),
		});

		return {
			organizationId: organizationResult.organizationId,
			userId: userResult.userId,
			accountId: accountResult.accountId,
			memberId: memberResult.memberId,
		};
	},
});

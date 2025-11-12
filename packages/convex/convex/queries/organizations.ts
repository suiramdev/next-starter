import { v } from "convex/values";
import { components } from "../_generated/api";
import { query } from "../_generated/server";
import { authComponent } from "../auth";

export const getOrganizationMembers = query({
	args: {
		organizationId: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		if (!user) {
			throw new Error("User not authenticated");
		}

		const isMemberOfOrganization = await ctx.runQuery(
			components.betterAuth.queries.members.isMemberOfOrganization,
			{
				userId: user._id,
				organizationId: args.organizationId,
			},
		);

		if (!isMemberOfOrganization) {
			throw new Error("User does not belong to organization");
		}

		return await ctx.runQuery(
			components.betterAuth.queries.members.getMembers,
			{
				organizationId: args.organizationId,
			},
		);
	},
});

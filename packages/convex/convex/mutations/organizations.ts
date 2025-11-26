import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { authComponent, createAuth } from "../auth";
import { ForbiddenError } from "../utils/errors";

export const updateOrganization = mutation({
	args: {
		organizationId: v.string(),
		name: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

		// Ensure that the organization exists and the current user is a member
		const organizations = await auth.api.listOrganizations({
			headers,
		});

		if (
			!organizations.some(
				(organization) => organization.id === args.organizationId,
			)
		) {
			throw new ForbiddenError();
		}

		const newSlug = args?.name
			? args.name
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/^-+|-+$/g, "")
			: undefined;

		await auth.api.updateOrganization({
			body: {
				data: {
					name: args.name,
					slug: newSlug,
				},
				organizationId: args.organizationId,
			},
			headers,
		});
	},
});

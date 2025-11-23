import { ConvexError, v } from "convex/values";
import { components } from "../_generated/api";
import { query } from "../_generated/server";
import { authComponent, createAuth } from "../auth";

export const listOrganizations = query({
	args: {},
	handler: async (ctx) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

		try {
			return await auth.api.listOrganizations({
				headers,
			});
		} catch (_error) {
			// If an error happens in the auth layer, return an empty array instead
			return [];
		}
	},
});

export const listMembers = query({
	args: {
		query: v.object({
			limit: v.optional(v.union(v.string(), v.number())),
			offset: v.optional(v.union(v.string(), v.number())),
			sortBy: v.optional(v.string()),
			sortDirection: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
			filterField: v.optional(v.string()),
			filterValue: v.optional(v.union(v.string(), v.number(), v.boolean())),
			filterOperator: v.optional(
				v.union(
					v.literal("eq"),
					v.literal("ne"),
					v.literal("lt"),
					v.literal("lte"),
					v.literal("gt"),
					v.literal("gte"),
					v.literal("contains"),
				),
			),
			organizationId: v.optional(v.string()),
		}),
	},
	handler: async (ctx, args) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

		try {
			return await auth.api.listMembers({
				headers,
				query: args.query,
			});
		} catch (_error) {
			// If an error happens in the auth layer, return an empty array instead
			return [];
		}
	},
});

export const getActiveMember = query({
	args: {},
	handler: async (ctx) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

		try {
			return await auth.api.getActiveMember({
				headers,
			});
		} catch (_error) {
			// If an error happens in the auth layer, return null instead
			return null;
		}
	},
});

export const getMember = query({
	args: {
		userId: v.string(),
		organizationId: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

		let organizationId = args.organizationId;
		if (!organizationId) {
			// If organizationId is not specified, retrieve it from the currently active member

			const member = await auth.api.getActiveMember({
				headers,
			});

			if (!member) {
				throw new ConvexError({
					message: "Unauthorized",
					code: 401,
				});
			}

			organizationId = member?.organizationId;
		} else {
			// Verify the user's membership and existence of the organization

			const organizations = await auth.api.listOrganizations({
				headers,
			});

			const organization = organizations.find(
				(organization) => organization.id === args.organizationId,
			);

			if (!organization) {
				throw new ConvexError({
					message: "Forbidden",
					code: 403,
				});
			}
		}

		return await ctx.runQuery(
			components.betterAuth.queries.organizations.getMember,
			{
				organizationId: organizationId,
				userId: args.userId,
			},
		);
	},
});

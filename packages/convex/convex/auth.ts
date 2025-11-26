import {
	type AuthFunctions,
	createClient,
	type GenericCtx,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { ac, roles } from "@repo/auth/permissions";
import { betterAuth } from "better-auth";
import { anonymous, organization } from "better-auth/plugins";
import { api, components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authSchema from "./betterAuth/generatedSchema";

const authFunctions: AuthFunctions = internal.auth;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel, typeof authSchema>(
	components.betterAuth,
	{
		authFunctions,
		local: {
			schema: authSchema,
		},
		triggers: {
			user: {
				onCreate: async (ctx, user) => {
					const defaultOrganizationId = await ctx.runQuery(
						api.queries.app_settings.getDefaultOrganizationId,
						{},
					);

					if (defaultOrganizationId) {
						// Assign user to default organization
						await ctx.runMutation(components.betterAuth.adapter.create, {
							input: {
								model: "member",
								data: {
									organizationId: defaultOrganizationId,
									userId: user._id,
									role: "member",
									createdAt: Date.now(),
								},
							},
						});
					}
				},
			},
		},
	},
);

export const createAuth = (
	ctx: GenericCtx<DataModel>,
	{ optionsOnly } = { optionsOnly: false },
) => {
	return betterAuth({
		// disable logging when createAuth is called just to generate options.
		// this is not required, but there's a lot of noise in logs without it.
		logger: {
			disabled: optionsOnly,
		},
		baseURL: process.env.SITE_URL,
		secret: process.env.BETTER_AUTH_SECRET,
		trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? [],
		database: authComponent.adapter(ctx),
		emailAndPassword: {
			enabled: true,
		},
		plugins: [
			// The Convex plugin is required for Convex compatibility
			convex(),
			organization({
				ac,
				roles,
				allowUserToCreateOrganization: () => false,
			}),
			anonymous(),
		],
		databaseHooks: {
			session: {
				create: {
					before: async (session) => {
						const activeOrganizationId = await ctx.runQuery(
							components.betterAuth.queries.organizations
								.getDefaultActiveOrganization,
							{
								userId: session.userId,
							},
						);

						return {
							data: {
								...session,
								activeOrganizationId,
							},
						};
					},
				},
			},
		},
	});
};

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		return authComponent.getAuthUser(ctx);
	},
});

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();

import {
	type AuthFunctions,
	createClient,
	type GenericCtx,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { admin, anonymous } from "better-auth/plugins";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
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
		baseURL: process.env.SITE_URL as string,
		secret: process.env.BETTER_AUTH_SECRET as string,
		trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? [],
		database: authComponent.adapter(ctx),
		emailAndPassword: {
			enabled: true,
		},
		socialProviders: {
			spotify: {
				clientId: process.env.SPOTIFY_CLIENT_ID as string,
				clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
				scope: [
					"user-read-email",
					"playlist-read-private",
					"playlist-read-collaborative",
				],
				redirectURI: process.env.SPOTIFY_REDIRECT_URI as string,
			},
		},
		account: {
			accountLinking: {
				enabled: true,
				trustedProviders: ["spotify"],
				allowDifferentEmails: true,
			},
		},
		plugins: [
			// The Convex plugin is required for Convex compatibility
			convex(),
			anonymous(),
			admin(),
		],
	});
};

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();

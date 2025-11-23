import { hashPassword } from "better-auth/crypto";
import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const setup = mutation({
	args: {
		organizationName: v.string(),
		name: v.string(),
		email: v.string(),
		password: v.string(),
	},
	returns: v.object({
		organizationId: v.id("organization"),
		userId: v.id("user"),
		memberId: v.id("member"),
	}),
	handler: async (ctx, args) => {
		// Create slug from organization name
		const slug = args.organizationName
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");

		// Create organization
		const organizationId = await ctx.db.insert("organization", {
			name: args.organizationName,
			slug,
			logo: null,
			createdAt: Date.now(),
			metadata: null,
		});

		// Create user
		const userId = await ctx.db.insert("user", {
			name: args.name,
			email: args.email,
			// TODO: Send verification email
			emailVerified: true,
			image: null,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			userId: null,
			isAnonymous: false,
		});

		// Set userId to the user's _id
		await ctx.db.patch(userId, {
			userId: userId,
		});

		const hashedPassword = await hashPassword(args.password);

		// Create account with credential provider
		// For email/password accounts, accountId is the email address and providerId is "credential"
		await ctx.db.insert("account", {
			accountId: args.email,
			providerId: "credential",
			userId: userId,
			password: hashedPassword,
			accessToken: null,
			refreshToken: null,
			idToken: null,
			accessTokenExpiresAt: null,
			refreshTokenExpiresAt: null,
			scope: null,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});

		// Create member record linking user to organization as owner
		const memberId = await ctx.db.insert("member", {
			organizationId: organizationId,
			userId: userId,
			role: "owner",
			createdAt: Date.now(),
		});

		return {
			organizationId,
			userId,
			memberId,
		};
	},
});

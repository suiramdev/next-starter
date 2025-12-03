import { hashPassword } from "better-auth/crypto";
import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const seedAdminUser = mutation({
	args: {
		email: v.string(),
		name: v.string(),
		password: v.string(),
	},
	handler: async (ctx, args) => {
		const existingUser = await ctx.db
			.query("user")
			.withIndex("email_name", (q) =>
				q.eq("email", args.email).eq("name", args.name),
			)
			.first();

		if (existingUser) {
			throw new Error("User already exists");
		}

		const hashedPassword = await hashPassword(args.password);

		const userId = await ctx.db.insert("user", {
			email: args.email,
			name: args.name,
			emailVerified: true,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			role: "admin",
		});

		const accountId = await ctx.db.insert("account", {
			providerId: "credential",
			userId: userId,
			password: hashedPassword,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			accountId: crypto.randomUUID(),
		});

		return {
			userId,
			accountId,
		};
	},
});

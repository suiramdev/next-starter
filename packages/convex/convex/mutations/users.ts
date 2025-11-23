import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { authComponent, createAuth } from "../auth";

export const updateUser = mutation({
	args: {
		name: v.optional(v.string()),
		email: v.optional(v.string()),
		image: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

		return await auth.api.updateUser({
			headers,
			body: {
				name: args.name,
				image: args.image,
			},
		});
	},
});

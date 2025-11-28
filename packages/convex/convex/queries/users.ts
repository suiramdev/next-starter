import { NotFoundError, UnauthorizedError } from "convex/utils/errors";
import { v } from "convex/values";
import { components } from "../_generated/api";
import { query } from "../_generated/server";
import { authComponent } from "../auth";

export const listUsers = query({
	args: {},
	returns: v.array(
		v.object({
			_id: v.string(),
			name: v.string(),
			email: v.string(),
			image: v.optional(v.union(v.null(), v.string())),
		}),
	),
	handler: async (ctx) => {
		const users = await ctx.runQuery(
			components.betterAuth.queries.users.listUsers,
		);

		return users.map((user) => ({
			_id: user._id,
			name: user.name,
			email: user.email,
			image: user.image,
		}));
	},
});

export const getUser = query({
	args: {
		userId: v.optional(v.string()),
	},
	returns: v.union(
		v.null(),
		v.object({
			_id: v.string(),
			name: v.string(),
			email: v.string(),
			image: v.optional(v.union(v.null(), v.string())),
		}),
	),
	handler: async (ctx, args) => {
		const user = await authComponent.safeGetAuthUser(ctx);

		if (!user) {
			throw new UnauthorizedError();
		}

		if (args.userId) {
			const user = await ctx.runQuery(
				components.betterAuth.queries.users.getUser,
				{
					userId: args.userId,
				},
			);

			if (!user) {
				throw new NotFoundError();
			}

			return {
				_id: user._id,
				name: user.name,
				email: user.email,
				image: user.image,
			};
		}

		return {
			_id: user._id,
			name: user.name,
			email: user.email,
			image: user.image,
		};
	},
});

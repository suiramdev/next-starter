import { v } from "convex/values";
import { components } from "../../_generated/api";
import { query } from "../../_generated/server";
import { NotFoundError, UnauthorizedError } from "../../shared/errors";
import { authComponent } from "../auth/setup";

export const listUsers = query({
	args: {},
	returns: v.array(
		v.object({
			_id: v.string(),
			_creationTime: v.number(),
			name: v.string(),
			email: v.string(),
			emailVerified: v.boolean(),
			image: v.optional(v.union(v.null(), v.string())),
		}),
	),
	handler: async (ctx) => {
		const users = await ctx.runQuery(
			components.betterAuth.queries.users.listUsers,
		);

		return users.map((user) => ({
			_id: user._id,
			_creationTime: user._creationTime,
			name: user.name,
			email: user.email,
			emailVerified: user.emailVerified,
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

export const hasRole = query({
	args: {
		role: v.string(),
		userId: v.optional(v.string()),
	},
	returns: v.boolean(),
	handler: async (ctx, args) => {
		let targetUserId: string | undefined;

		if (args.userId) {
			// Use the specified user ID
			targetUserId = args.userId;
		} else {
			// Use the authenticated user
			const authUser = await authComponent.safeGetAuthUser(ctx);
			if (!authUser) {
				return false;
			}
			targetUserId = authUser._id || authUser.userId || undefined;
		}

		if (!targetUserId) {
			return false;
		}

		// Get the full user object to access the role field
		const fullUser = await ctx.runQuery(
			components.betterAuth.queries.users.getUser,
			{
				userId: targetUserId,
			},
		);

		if (!fullUser) {
			return false;
		}

		// The role field is optional, so we need to check it safely
		return !!fullUser.role && fullUser.role === args.role;
	},
});

export const hasPermission = query({
	args: {
		resource: v.string(),
		action: v.string(),
		userId: v.optional(v.string()),
	},
	returns: v.boolean(),
	handler: async (ctx, args) => {
		let targetUserId: string | undefined;

		if (args.userId) {
			// Use the specified user ID
			targetUserId = args.userId;
		} else {
			// Use the authenticated user
			const authUser = await authComponent.safeGetAuthUser(ctx);
			if (!authUser) {
				return false;
			}
			targetUserId = authUser._id || authUser.userId || undefined;
		}

		if (!targetUserId) {
			return false;
		}

		// Get the full user object to access the role field
		const fullUser = await ctx.runQuery(
			components.betterAuth.queries.users.getUser,
			{
				userId: targetUserId,
			},
		);

		if (!fullUser) {
			return false;
		}

		// The role field is optional, so we need to check it safely
		if (!fullUser.role) {
			return false;
		}

		// Get the role from the roles object
		const userRole = fullUser.role[fullUser.role as keyof typeof fullUser.role];
		if (!userRole) {
			return false;
		}

		// Check if the role has the permission by checking the role's statements
		// The role object has statements that define what permissions it has
		const roleStatements = userRole.statements;
		if (!roleStatements) {
			return false;
		}

		// Check if the resource exists in the role's statements
		const resourcePermissions =
			roleStatements[args.resource as keyof typeof roleStatements];
		if (!resourcePermissions || !Array.isArray(resourcePermissions)) {
			return false;
		}

		// Check if the action is in the resource's permissions
		return resourcePermissions.includes(args.action as never);
	},
});

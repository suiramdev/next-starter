import { v } from "convex/values";
import { systemFields } from "convex-helpers/validators";
import { ForbiddenError, NotFoundError } from "#convex/utils/errors";
import { query } from "../_generated/server";
import schema from "../schema";

const memberWithSystemFields = systemFields("member");
const userWithSystemFields = systemFields("user");

export const getDefaultActiveOrganization = query({
	args: {
		userId: v.string(),
	},
	returns: v.string(),
	handler: async (ctx, args) => {
		const member = await ctx.db
			.query("member")
			.withIndex("userId", (q) => q.eq("userId", args.userId))
			.first();

		if (!member) {
			throw new NotFoundError();
		}

		return member.organizationId;
	},
});

export const getMember = query({
	args: {
		organizationId: v.string(),
		userId: v.string(),
	},
	returns: v.union(
		v.null(),
		v.object({
			...memberWithSystemFields,
			...schema.tables.member.validator.fields,
			user: v.union(
				v.null(),
				v.object({
					...userWithSystemFields,
					...schema.tables.user.validator.fields,
				}),
			),
		}),
	),
	handler: async (ctx, args) => {
		const member = await ctx.db
			.query("member")
			.withIndex("by_organizationId_and_userId", (q) =>
				q.eq("organizationId", args.organizationId).eq("userId", args.userId),
			)
			.unique();

		if (!member) {
			throw new ForbiddenError();
		}

		const user = await ctx.db
			.query("user")
			.withIndex("userId", (q) => q.eq("userId", member.userId))
			.unique();

		return {
			...member,
			user: user,
		};
	},
});

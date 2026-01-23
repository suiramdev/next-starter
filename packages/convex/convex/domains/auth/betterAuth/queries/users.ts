import { v } from "convex/values";
import { systemFields } from "convex-helpers/validators";
import { query } from "../_generated/server";
import schema from "../schema";

export const listUsers = query({
	args: {},
	returns: v.array(
		v.object({
			...schema.tables.user.validator.fields,
			...systemFields("user"),
		}),
	),
	handler: async (ctx) => {
		return await ctx.db.query("user").collect();
	},
});

export const getUser = query({
	args: {
		userId: v.id("user"),
	},
	returns: v.union(
		v.null(),
		v.object({
			...schema.tables.user.validator.fields,
			...systemFields("user"),
		}),
	),
	handler: async (ctx, args) => {
		return await ctx.db.get(args.userId);
	},
});

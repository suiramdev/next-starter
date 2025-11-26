import { query } from "../_generated/server";

export const getDefaultOrganizationId = query({
	args: {},
	handler: async (ctx) => {
		const setting = await ctx.db
			.query("app_settings")
			.withIndex("by_key", (q) => q.eq("key", "defaultOrganizationId"))
			.unique();

		return setting?.value as string | null;
	},
});

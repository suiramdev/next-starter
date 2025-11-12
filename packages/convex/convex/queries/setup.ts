import { query } from "../_generated/server";

export const isSetupCompleted = query({
  args: {},
  handler: async (ctx) => {
    const setting = await ctx.db
      .query("app_settings")
      .withIndex("by_key", (q) => q.eq("key", "is_setup"))
      .first();

    return setting?.value === true;
  },
});

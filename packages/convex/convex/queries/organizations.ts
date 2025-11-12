import { query } from "../_generated/server";
import { v } from "convex/values";
import { components } from "../_generated/api";

export const getOrganizationMembers = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.runQuery(
      components.betterAuth.queries.organizations.getOrganizationMembers,
      {
        organizationId: args.organizationId,
      }
    );
  },
});

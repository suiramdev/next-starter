import { query } from "../_generated/server";
import { v } from "convex/values";
import { components } from "../_generated/api";
import { authComponent } from "../auth";

export const getMembers = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    return await ctx.runQuery(
      components.betterAuth.queries.members.getMembers,
      {
        organizationId: args.organizationId,
      }
    );
  },
});

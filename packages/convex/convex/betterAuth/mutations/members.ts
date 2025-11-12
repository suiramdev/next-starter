import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    organizationId: v.id("organization"),
    userId: v.id("user"),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const memberId = await ctx.db.insert("member", {
      organizationId: args.organizationId,
      userId: args.userId,
      role: args.role ?? "admin",
      createdAt: Date.now(),
    });

    return {
      memberId: memberId,
    };
  },
});

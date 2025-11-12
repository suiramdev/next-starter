import { query } from "../_generated/server";
import { v } from "convex/values";

export const getOrganizationMembers = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const members = await ctx.db
      .query("member")
      .withIndex("organizationId", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .collect();

    // Add user relationship: fetch user for each member
    const users = await Promise.all(
      members.map((member) =>
        ctx.db
          .query("user")
          .withIndex("userId", (q) => q.eq("userId", member.userId))
          .unique()
      )
    );

    // Combine member and user data
    return members.map((member, idx) => ({
      ...member,
      user: users[idx] || null,
    }));
  },
});

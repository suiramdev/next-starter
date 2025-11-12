import { query } from "../_generated/server";
import { v } from "convex/values";
import { withSystemFields } from "convex-helpers/validators";
import schema from "../generatedSchema";

const memberWithSystemFields = v.object(
  withSystemFields("member", schema.tables.member.validator.fields)
);

const userWithSystemFields = v.object(
  withSystemFields("user", schema.tables.user.validator.fields)
);

export const getMembers = query({
  args: {
    organizationId: v.string(),
  },
  returns: v.array(
    memberWithSystemFields.extend({
      user: v.union(v.null(), userWithSystemFields),
    })
  ),
  handler: async (ctx, args) => {
    const members = await ctx.db
      .query("member")
      .withIndex("organizationId", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .collect();

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

export const isMemberOfOrganization = query({
  args: {
    userId: v.id("user"),
    organizationId: v.id("organization"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const member = await ctx.db
      .query("member")
      .withIndex("organizationId_userId", (q) =>
        q.eq("organizationId", args.organizationId).eq("userId", args.userId)
      )
      .unique();

    // If the member is found, return true, otherwise false
    return member !== null;
  },
});

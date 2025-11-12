import { query } from "../_generated/server";
import { authComponent } from "../auth";

export const getOrganizations = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return [];
    }

    // Get all memberships for the user
    const memberships = await ctx.db
      .query("member")
      .withIndex("by_userId", (q) => q.eq("userId", user.id))
      .collect();

    // Get organizations for each membership
    const organizations = await Promise.all(
      memberships.map(async (membership) => {
        const org = await ctx.db
          .query("organization")
          .withIndex("by_id", (q) => q.eq("id", membership.organizationId))
          .first();
        return org;
      })
    );

    return organizations.filter(
      (org): org is NonNullable<typeof org> => org !== null
    );
  },
});

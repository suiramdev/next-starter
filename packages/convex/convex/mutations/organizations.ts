import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { authComponent } from "../auth";

export const createOrganization = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Get current user
    const user = await authComponent.getAuthUser(ctx);
    if (!user || !user.userId) {
      throw new Error("Unauthorized");
    }

    // Generate slug from organization name
    const slug = args.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check if slug already exists
    const existingOrg = await ctx.db
      .query("organization")
      .withIndex("slug", (q) => q.eq("slug", slug))
      .first();

    if (existingOrg) {
      throw new Error("An organization with this name already exists");
    }

    const now = Date.now();

    // Create organization
    const organizationId = await ctx.db.insert("organization", {
      name: args.name,
      slug: slug || "default",
      createdAt: now,
    });

    // Create member relationship
    await ctx.db.insert("member", {
      organizationId: organizationId,
      userId: user.userId,
      role: "owner",
      createdAt: now,
    });

    return organizationId;
  },
});

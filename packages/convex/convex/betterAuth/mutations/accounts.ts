import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { auth } from "../auth";

export const create = mutation({
  args: {
    userId: v.id("user"),
    userEmail: v.string(),
    userPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const authContext = await auth.$context;
    const hashedPassword = await authContext.password.hash(args.userPassword);

    const accountId = await ctx.db.insert("account", {
      accountId: args.userEmail,
      providerId: "credential",
      userId: args.userId,
      password: hashedPassword,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return {
      accountId: accountId,
    };
  },
});

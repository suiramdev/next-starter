import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { createAuth } from "../auth";
import { components } from "../_generated/api";

export const setup = mutation({
  args: {
    organizationName: v.string(),
    userEmail: v.string(),
    userPassword: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if already setup
    const existingSetting = await ctx.db
      .query("app_settings")
      .withIndex("by_key", (q) => q.eq("key", "is_setup"))
      .first();

    if (existingSetting?.value === true) {
      throw new Error("Application is already setup");
    }

    // Generate slug from organization name
    const slug = args.organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Hash password using Better Auth's password hashing utility
    const auth = createAuth(ctx);
    const authContext = await auth.$context;
    const hashedPassword = await authContext.password.hash(args.userPassword);

    const now = Date.now();

    // Insert organization into Better Auth component schema
    const organizationResult = await ctx.runMutation(
      components.betterAuth.adapter.create,
      {
        input: {
          model: "organization",
          data: {
            name: args.organizationName,
            slug: slug || "default",
            createdAt: now,
          },
        },
      }
    );
    const organizationId = organizationResult._id;

    // Insert user into Better Auth component schema
    const userResult = await ctx.runMutation(
      components.betterAuth.adapter.create,
      {
        input: {
          model: "user",
          data: {
            name: args.userName,
            email: args.userEmail,
            emailVerified: false,
            image: null,
            createdAt: now,
            updatedAt: now,
          },
        },
      }
    );
    const userId = userResult._id;

    // Insert account into Better Auth component schema
    await ctx.runMutation(components.betterAuth.adapter.create, {
      input: {
        model: "account",
        data: {
          accountId: args.userEmail,
          providerId: "credential",
          userId: userId as string,
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
      },
    });

    // Insert member into Better Auth component schema
    await ctx.runMutation(components.betterAuth.adapter.create, {
      input: {
        model: "member",
        data: {
          organizationId: organizationId as string,
          userId: userId as string,
          role: "admin",
          createdAt: now,
        },
      },
    });

    // Set is_setup flag
    if (existingSetting) {
      await ctx.db.patch(existingSetting._id, {
        value: true,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("app_settings", {
        key: "is_setup",
        value: true,
        updatedAt: now,
      });
    }
  },
});

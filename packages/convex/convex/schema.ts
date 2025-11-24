import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	app_settings: defineTable({
		key: v.string(),
		value: v.any(),
		updatedAt: v.number(),
	}).index("by_key", ["key"]),
	organization_settings: defineTable({
		organizationId: v.string(),
		allowAnonymousLogin: v.optional(v.union(v.null(), v.boolean())),
		allowUserSignUp: v.optional(v.union(v.null(), v.boolean())),
	}).index("by_organizationId", ["organizationId"]),
});

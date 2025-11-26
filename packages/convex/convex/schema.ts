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
		key: v.string(),
		value: v.any(),
		updatedAt: v.number(),
	}).index("by_organizationId_and_key", ["organizationId", "key"]),
	rooms: defineTable({
		name: v.string(),
		code: v.string(),
		hostId: v.string(), // userId
		isPrivate: v.boolean(),
		status: v.union(
			v.literal("waiting"),
			v.literal("playing"),
			v.literal("finished"),
		),
		playlistId: v.optional(v.string()),
		playlistName: v.optional(v.string()),
		playlistImage: v.optional(v.string()),
	})
		.index("by_status", ["status"])
		.index("by_code_and_status", ["code", "status"]),
	players: defineTable({
		roomId: v.id("rooms"),
		userId: v.string(),
		score: v.number(),
	})
		.index("by_roomId", ["roomId"])
		.index("by_userId", ["userId"])
		.index("by_roomId_and_userId", ["roomId", "userId"]),
});

import { defineSchema } from "convex/server";
import { tables } from "./generatedSchema";

export default defineSchema({
	...tables,
	member: tables.member.index("by_organizationId_and_userId", {
		fields: ["organizationId", "userId"],
	}),
});

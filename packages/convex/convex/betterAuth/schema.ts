import { defineSchema, defineTable } from "convex/server";
import { tables } from "./generatedSchema";

export default defineSchema({
  ...tables,
  member: tables.member.index("organizationId_userId", [
    "organizationId",
    "userId",
  ]),
});

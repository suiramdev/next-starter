import { z } from "zod";
import { syncedQueryWithContext } from "@rocicorp/zero";
import { builder } from "../schema";

/**
 * Synced query that returns all organizations.
 * This is a public query that can be used during sign-up.
 */
export const getOrganizations = syncedQueryWithContext(
  "getOrganizations",
  z.tuple([]),
  (ctx: { userId: string }) => {
    return builder.organization
      .related("users", (q) => q.where("userId", "=", ctx.userId))
      .orderBy("name", "asc");
  }
);

import { z } from "zod";
import { syncedQueryWithContext } from "@rocicorp/zero";
import { builder } from "../schema";

/**
 * Synced query that returns users accessible to the authenticated user.
 * Users are filtered based on shared organization membership.
 */
export const getUsers = syncedQueryWithContext(
  "getUsers",
  z.tuple([]), // No arguments needed - filtering is based on auth context
  (ctx: { userId: string }) => {
    // Find users who share at least one organization with the authenticated user
    // This uses a subquery to find organization IDs the user belongs to,
    // then finds all users who belong to those same organizations
    return builder.user.whereExists("organizations", (q) =>
      q.where("userId", "=", ctx.userId)
    );
  }
);

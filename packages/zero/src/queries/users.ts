import { z } from "zod";
import { syncedQueryWithContext } from "@rocicorp/zero";
import { builder } from "../schema";

/**
 * Synced query that returns users accessible to the authenticated user.
 * Users are filtered based on shared organization membership.
 */
export const getUsers = syncedQueryWithContext(
  "getUsers",
  z.tuple([]),
  (ctx: { userId: string }) => {
    return builder.user.related("organizations", (q) =>
      q.where("userId", "=", ctx.userId)
    );
  }
);

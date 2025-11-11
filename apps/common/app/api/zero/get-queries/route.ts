import { getQueriesHandler } from "@repo/zero/helpers/next-js";
import { auth } from "@repo/auth";
import { NextRequest } from "next/server";

/**
 * Get authentication data from the request.
 * Returns the user ID if authenticated, undefined otherwise.
 */
async function getAuthData(request: NextRequest): Promise<{ userId: string }> {
  const session = await auth.api.getSession(request);

  if (!session?.user?.id) {
    return { userId: "anon" };
  }

  return { userId: session.user.id };
}

export const POST = getQueriesHandler(getAuthData);

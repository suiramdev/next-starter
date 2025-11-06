import { mutateHandler } from "@repo/zero/helpers/next-js";
import { auth } from "@repo/auth";
import { cookies } from "next/headers";

/**
 * Get authentication data from the request.
 * Returns the user ID if authenticated, undefined otherwise.
 */
async function getAuthData(): Promise<{ userId: string } | undefined> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const session = await auth.api.getSession({
    headers: {
      cookie: cookieHeader,
    },
  });

  if (!session?.user?.id) {
    return undefined;
  }

  return { userId: session.user.id };
}

/**
 * Push endpoint for Zero mutations.
 * This endpoint processes mutations from Zero clients and applies them to the database.
 */
export const POST = mutateHandler(getAuthData);

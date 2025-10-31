import { Zero } from "@rocicorp/zero";
import { schema } from "./schema";
import { env } from "@repo/env/client";

type AuthOption = string | (() => Promise<string | undefined>) | undefined;

export interface ZeroClientOptions {
  userID: string;
  auth?: AuthOption;
}

/**
 * Creates a Zero client instance with authentication support.
 *
 * @param options - Configuration options for the Zero client
 * @param options.userID - The user ID (should match the 'sub' field in the JWT token)
 * @param options.auth - Auth token or function that returns a token. Can be:
 *   - A string token
 *   - A function that returns a Promise<string | null>
 *   - null/undefined for unauthenticated access
 * @returns A configured Zero client instance
 */
export function createZeroClient(options: ZeroClientOptions | string) {
  // Support legacy API where userID is passed as a string
  const opts: ZeroClientOptions =
    typeof options === "string" ? { userID: options } : options;

  return new Zero({
    userID: opts.userID,
    auth: opts.auth ?? undefined,
    server: env.NEXT_PUBLIC_ZERO_SERVER,
    schema,
  });
}

export type ZeroClient = ReturnType<typeof createZeroClient>;

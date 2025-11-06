import { Zero } from "@rocicorp/zero";
import { env } from "@repo/env/client";
import { schema } from "@repo/db/zero";
import { createMutators } from "./mutators";

export type AuthData =
  | {
      userId: string;
    }
  | undefined;

type AuthOption = string | (() => Promise<string | undefined>) | undefined;

export interface ZeroClientOptions {
  userID: string;
  auth?: AuthOption;
}

/**
 * Creates a Zero client instance with authentication support and custom mutators.
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

  // Extract userId from userID for mutators
  const authData = opts.userID !== "anon" ? { userId: opts.userID } : undefined;

  return new Zero({
    userID: opts.userID,
    auth: opts.auth ?? undefined,
    server: env.NEXT_PUBLIC_ZERO_SERVER,
    schema,
    mutators: createMutators(authData),
    mutateURL: env.NEXT_PUBLIC_ZERO_MUTATE_URL,
  });
}

export type ZeroClient = ReturnType<typeof createZeroClient>;

export * from "@rocicorp/zero";

import type { AuthData } from "../client";

/**
 * Client-side mutators for Zero.
 * These mutators run immediately on the client for instant UI updates,
 * then sync to the server in the background.
 */
export function createMutators(_authData: AuthData) {
  return {} as const;
}

export type Mutators = ReturnType<typeof createMutators>;

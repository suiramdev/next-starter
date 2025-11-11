import type { AuthData } from "../client";
import { createOrganizationMutator } from "./organizations";

/**
 * Client-side mutators for Zero.
 * These mutators run immediately on the client for instant UI updates,
 * then sync to the server in the background.
 */
export function createMutators(authData: AuthData) {
  return {
    ...createOrganizationMutator(authData),
  } as const;
}

export type Mutators = ReturnType<typeof createMutators>;

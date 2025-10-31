"use client";

import {
  ZeroProvider as ZeroProviderBase,
  useZero as useZeroBase,
  useQuery as useQueryBase,
  useSuspenseQuery as useSuspenseQueryBase,
} from "@rocicorp/zero/react";
import { createZeroClient, type ZeroClient } from "../client";
import { useMemo, type ReactNode } from "react";
import type { Schema } from "../schema";
import { authClient } from "@repo/auth/helpers/react/client";
import { env } from "@repo/env/client";

type ZeroProviderProps = {
  children: ReactNode;
};

/**
 * Fetches a Zero auth token from the API endpoint.
 * @returns Promise that resolves to the token string or undefined
 */
async function fetchZeroToken(): Promise<string | undefined> {
  try {
    const baseURL = env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL;
    const response = await fetch(`${baseURL}/api/zero/token`, {
      credentials: "include", // Include cookies for authentication
    });

    if (!response.ok) {
      return undefined;
    }

    const data = await response.json();
    return data.token ?? undefined;
  } catch (error) {
    console.error("Failed to fetch Zero token:", error);
    return undefined;
  }
}

/**
 * ZeroProvider wrapper that creates a Zero instance with our configuration.
 * Uses Zero's official ZeroProvider from @rocicorp/zero/react.
 * Automatically gets user ID and role from auth session and fetches auth token.
 */
export function ZeroProvider({ children }: ZeroProviderProps) {
  const { data: session } = authClient.useSession();

  const zero = useMemo(() => {
    // Get user ID from auth session, fallback to 'anon' if not authenticated
    const userID = session?.user?.id ?? "anon";

    // Create auth function that fetches token when needed
    // Zero will call this function to get/refresh the token
    const authFn = async () => {
      return fetchZeroToken();
    };

    return createZeroClient({
      userID,
      auth: session?.user?.id ? authFn : undefined,
    });
  }, [session?.user?.id]);

  return <ZeroProviderBase zero={zero}>{children}</ZeroProviderBase>;
}

/**
 * Hook to get the Zero instance.
 * Re-exports Zero's official useZero hook.
 */
export function useZero<TSchema extends Schema = Schema>() {
  return useZeroBase<TSchema>();
}

/**
 * Hook to query data reactively.
 * Re-exports Zero's official useQuery hook.
 * Zero handles type inference internally.
 *
 * @example
 * ```tsx
 * const z = useZero();
 * const [users] = useQuery(z.query.user);
 * ```
 */
export const useQuery = useQueryBase;

/**
 * Hook to query data with React Suspense support.
 * Re-exports Zero's official useSuspenseQuery hook.
 * Zero handles type inference internally.
 */
export const useSuspenseQuery = useSuspenseQueryBase;

export type { ZeroClient };

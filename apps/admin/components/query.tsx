"use client";

import { ZeroProvider } from "@repo/zero/helpers/react";
import { createZeroClient } from "@repo/zero/client";
import { authClient } from "@repo/auth/helpers/react/client";
import { env } from "@repo/env/client";
import { useMemo } from "react";

type QueryProviderProps = {
  children: React.ReactNode;
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

export function QueryProvider({ children }: QueryProviderProps) {
  const { data: session } = authClient.useSession();

  // Get user ID from auth session, fallback to 'anon' if not authenticated
  const userID = session?.user?.id ?? "anon";

  // Create Zero client instance with authentication
  const zero = useMemo(() => {
    return createZeroClient({
      userID,
      auth: session?.user?.id ? fetchZeroToken : undefined,
    });
  }, [userID, session?.user?.id]);

  return <ZeroProvider zero={zero}>{children}</ZeroProvider>;
}
